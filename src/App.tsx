import { useState } from 'react';

import { Autocomplete } from './components/Autocomplete';

import './App.css';

export function App() {
  const [text, setText] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  async function getOptions(text: string) {
    setOptions(['Maria', 'Marcela', 'Dan', 'Rick', 'Glory']);
    setLoading(false);
  }

  async function handleChange(text: string) {
    setText(text);
    setOptions([]);
    setLoading(true);

    if (text.trim().length) getOptions(text);
  }

  function handleSelect(option: string) {
    setText(option);
    setOptions([]);
  }

  return (
    <div className="app">
      <header className="app__header">
        <h2 className="app_title">Autocomplete</h2>
      </header>
      <main className="app__main">
        <div className="app_subtitle">
          Please enter part of the name you are looking for
        </div>
        <div className="app__ac-wrapper">
          <Autocomplete
            text={text}
            options={options}
            loading={loading}
            onChange={handleChange}
            onSelect={handleSelect}
          />
        </div>
      </main>
    </div>
  );
}
