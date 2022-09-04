import { describe, expect, test, vi } from 'vitest';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within
} from '@testing-library/react';
import { Autocomplete } from './Autocomplete';

describe('Autocomplete component', () => {
  test('component renders', async () => {
    render(
      <Autocomplete
        text=''
        options={[]}
        loading={false}
        onChange={() => vi.fn()}
        onSelect={() => vi.fn()}
      />
    )

    expect(screen.getByRole('textbox')).toBeInTheDocument();

    // the dropdown should not appear in the first render
    expect(screen.queryByTestId('ac-list')).not.toBeInTheDocument();
  })

  test('handles user input', async () => {
    const handleChange = vi.fn()

    render(
      <Autocomplete
        text=''
        options={[]}
        loading={false}
        onChange={handleChange}
        onSelect={() => vi.fn()}
      />
    )

    fireEvent.input(screen.getByRole('textbox'), {
      target: {value: 'Lannister'}
    })

    await waitFor(() => {
      expect(handleChange).toHaveBeenCalledWith('Lannister')
    })
  })

  test('displays the popup if there are options in the list, highlighting the matches', async () => {
    render(
      <Autocomplete
        text='Lann'
        options={['Alton Lannister', 'Cersei Lannister']}
        loading={false}
        onChange={() => vi.fn()}
        onSelect={() => vi.fn()}
      />
    )

    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByTestId('ac-list')).toBeInTheDocument()
    expect(screen.getByTestId('ac-list')).toHaveTextContent('Alton Lannister')
    expect(screen.getByTestId('ac-list')).toHaveTextContent('Cersei Lannister')

    // check that the user input is being highlighted
    expect(within(screen.getByTestId('ac-list')).getAllByTestId('ac-highlight')).toHaveLength(2)
    expect(within(screen.getByTestId('ac-list')).getAllByTestId('ac-highlight')[0]).toHaveTextContent(/^Lann$/)
    expect(within(screen.getByTestId('ac-list')).getAllByTestId('ac-highlight')[1]).toHaveTextContent(/^Lann$/)
  })

  test('displays a "not found" messages if there is input but no matches', async () => {
    render(
      <Autocomplete
        text='Maester'
        options={[]}
        loading={false}
        onChange={() => vi.fn()}
        onSelect={() => vi.fn()}
      />
    )
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.queryByTestId('ac-list')).not.toBeInTheDocument()
    expect(screen.getByText('No results found')).toBeInTheDocument()
  })

  test('displays a "fetching data" message while loading', async () => {
    render(
      <Autocomplete
        text='Maester'
        options={[]}
        loading={true}
        onChange={() => vi.fn()}
        onSelect={() => vi.fn()}
      />
    )
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.queryByTestId('ac-list')).not.toBeInTheDocument()
    expect(screen.getByText('Fetching options...')).toBeInTheDocument()
  })

  test('triggers onSelect when user selects an item from the list', async () => {
    const handleItemSelect = vi.fn()

    render(
      <Autocomplete
        text='Targ'
        options={['Daenerys Targaryen', 'Rhaegar Targaryen']}
        loading={false}
        onChange={() => vi.fn()}
        onSelect={handleItemSelect}
      />
    )

    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByTestId('ac-list')).toBeInTheDocument()
    expect(screen.getByTestId('ac-list')).toHaveTextContent('Daenerys Targaryen')
    expect(screen.getByTestId('ac-list')).toHaveTextContent('Rhaegar Targaryen')

    // click the first item
    const item = within(screen.getByTestId('ac-list')).getAllByTestId('ac-highlight')[0]
    fireEvent.click(item)
    await waitFor(() => {
      expect(handleItemSelect).toHaveBeenCalledWith('Daenerys Targaryen')
    })
  })
})
