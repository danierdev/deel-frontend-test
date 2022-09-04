import { describe, expect, test, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import { App } from './App';

// Mocking of the global fetch to avoid perform real requests
function FetchMock() {
  return Promise.resolve({
    json: () => Promise.resolve([
      { id: "18qajd", name: "Aerys Targaryen" },
      { id: "ctpbdy", name: "Viserys Targaryen" },
    ]),
  })
}

describe('App component', () => {
  let fetchSpy

  beforeAll(() => {
    global.fetch = FetchMock;
  })

  test('component renders', async () => {
    render(<App />);

    expect(screen.getByText('Search Game Of Thrones Characters')).toBeInTheDocument();
    expect(screen.getByText('Please enter part of the name you are looking for')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.queryByTestId('ac-list')).not.toBeInTheDocument();
  })

  test('searches and display a popup with the results', async () => {
    fetchSpy = vi.spyOn(global, 'fetch');
    render(<App />);

    fireEvent.input(screen.getByRole('textbox'), { target: { value: 'Targa' } })
    await waitFor(() => {
      expect(screen.getByText('Fetching options...')).toBeInTheDocument();
    })
    await waitFor(() => {
      // expect that the endpoint was called with the user input
      expect(fetchSpy).toBeCalledWith('/api/characters?name=Targa')
    });
    expect(screen.getByTestId('ac-list')).toBeInTheDocument();
    const matches = screen.getAllByTestId('ac-list-option');
    expect(matches).toHaveLength(2);
    // expect only results which contains "Targa" characters
    expect(matches[0]).toHaveTextContent('Aerys Targaryen');
    expect(matches[1]).toHaveTextContent('Viserys Targaryen');
  })

  test('fills the input text with an option value when it is clicked', async () => {
    global.fetch = FetchMock;
    render(<App />);

    fireEvent.input(screen.getByRole('textbox'), { target: { value: 'Targa' } });
    await waitFor(() => {
      expect(screen.getByTestId('ac-list')).toBeInTheDocument();
    })
    const matches = screen.getAllByTestId('ac-list-option');
    expect(matches).toHaveLength(2);
    fireEvent.click(matches[0]);

    await waitFor(() => {
      expect(screen.getByRole('textbox')).toHaveValue('Aerys Targaryen')
    });
  })

  test('removes the item list after user empties the input', async () => {
    global.fetch = FetchMock
    render(<App />)

    // first put some value to display the list
    fireEvent.input(screen.getByRole('textbox'), { target: { value: 'oxf' } })
    await waitFor(() => {
      expect(screen.getByTestId('ac-list')).toBeInTheDocument();
    })

    // now let's empty the input
    fireEvent.input(screen.getByRole('textbox'), { target: { value: '' } });
    await waitFor(() => {
      expect(screen.queryByTestId('ac-list')).not.toBeInTheDocument();
    })
  })
})
