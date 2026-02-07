interface SvgPreviewProps {
  svgString: string | null;
}

export function SvgPreview({ svgString }: SvgPreviewProps) {
  if (!svgString) {
    return (
      <div className="svg-preview svg-preview-empty">
        <p>「Generate」ボタンをクリックしてチャートを生成してください</p>
      </div>
    );
  }

  return (
    <div
      className="svg-preview"
      dangerouslySetInnerHTML={{ __html: svgString }}
    />
  );
}
