import { useState, useMemo } from 'react';

import { getCharacters } from '../../api/GotApi';
import { Autocomplete } from '../Autocomplete';
import { debounce } from '../../utils';

import './App.css';

const DEBOUNCE_DELAY = 500;

export function App() {
  const [text, setText] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const getDelayedOptions = useMemo(() => {
    return debounce((value: string) => getOptions(value), DEBOUNCE_DELAY);
  }, []);

  async function getOptions(text: string) {
    const names = await getCharacters(text);
    setOptions(names);
    setLoading(false);
  }

  async function handleChange(text: string) {
    setText(text);
    setOptions([]);
    setLoading(true);
    if (text.trim().length) getDelayedOptions(text);
  }

  function handleSelect(option: string) {
    setText(option);
    setOptions([]);
  }

  return (
    <div className="app">
      <header className="app__header">
        <h2 className="app_title">Search Game Of Thrones Characters</h2>
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
