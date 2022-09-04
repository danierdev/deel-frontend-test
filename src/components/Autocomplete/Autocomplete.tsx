import { ChangeEvent, useState } from 'react';

import { AutocompleteList } from './AutocompleteList';

import './Autocomplete.css';

export interface AutocompleteProps {
  text: string;
  options: Array<string>;
  loading: boolean;
  onChange: (option: string, fetch?: boolean) => void;
  onSelect: (option: string) => void;
}

export function Autocomplete({ text, options, loading, onChange, onSelect }: AutocompleteProps) {
  const [selected, setSelected] = useState(false);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setSelected(false);
    onChange(e.target.value);
  }

  function handleSelect(option: string) {
    setSelected(true);
    onSelect(option);
  }

  return (
    <div className="ac">
      <input className="ac-input" type="text" value={text} onChange={handleChange} />
      {!!text.length && !selected && (
        <AutocompleteList
          text={text}
          options={options}
          loading={loading}
          onSelect={handleSelect}
        />
      )}
    </div>
  );
}
