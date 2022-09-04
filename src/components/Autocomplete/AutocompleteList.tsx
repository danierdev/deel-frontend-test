export interface AutocompleteListProps {
  text: string;
  options: Array<string>;
  loading: boolean;
  onSelect: (option: string) => void;
}

export function AutocompleteList({ text, options, loading, onSelect }: AutocompleteListProps) {
  if (loading) return <EmptyState message="Fetching options..." />

  if (text && !options.length) return <EmptyState message="No results found" />

  return (
    <div className="ac-list">
      {options.map((option, idx) => (
        <div
          key={`ac-list-option-${idx}`}
          className="ac-list__option"
          onClick={() => onSelect(option)}
        >
          {option}
        </div>
      ))}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return <div className="ac-list-empty">{message}</div>
}
