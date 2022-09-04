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
    <div className="ac-list" data-testid="ac-list">
      {options.map((option, idx) => (
        <div
          key={`ac-list-option-${idx}`}
          className="ac-list__option"
          dangerouslySetInnerHTML={{
            __html: highlight(text, option)
          }}
          onClick={() => onSelect(option)}
          data-testid="ac-list-option"
        />
      ))}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return <div className="ac-list-empty">{message}</div>
}

function highlight(text: string, sentence: string) {
  const wordRegex = new RegExp(`(${text})`, 'gi');
  return sentence.replace(wordRegex, '<span class="ac-highlight" data-testid="ac-highlight">$1</span>');
}
