interface ToolbarProps {
  onGenerate: () => void;
  onDownload: () => void;
  canDownload: boolean;
}

export function Toolbar({ onGenerate, onDownload, canDownload }: ToolbarProps) {
  return (
    <div className="toolbar">
      <button className="btn btn-primary" onClick={onGenerate}>
        Generate
      </button>
      <button
        className="btn btn-secondary"
        onClick={onDownload}
        disabled={!canDownload}
      >
        Download SVG
      </button>
    </div>
  );
}
