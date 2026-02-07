interface YamlEditorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error: string | null;
  rows?: number;
}

export function YamlEditor({
  label,
  value,
  onChange,
  error,
  rows = 14,
}: YamlEditorProps) {
  return (
    <div className="yaml-editor">
      <label className="yaml-editor-label">{label}</label>
      <textarea
        className={`yaml-input${error ? " has-error" : ""}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        spellCheck={false}
      />
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}
