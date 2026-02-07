import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { YamlEditor } from "./components/YamlEditor";
import { SvgPreview } from "./components/SvgPreview";
import { Toolbar } from "./components/Toolbar";
import { useChartGenerator } from "./hooks/useChartGenerator";
import { EXAMPLE_DATA_YAML, EXAMPLE_STYLE_YAML } from "./lib/example-data";
import "./App.css";

export function App() {
  const [dataYaml, setDataYaml] = useState(EXAMPLE_DATA_YAML);
  const [styleYaml, setStyleYaml] = useState(EXAMPLE_STYLE_YAML);
  const { svg, dataError, styleError, generate } = useChartGenerator();

  useEffect(() => {
    generate(dataYaml, styleYaml);
  }, []);

  const handleGenerate = () => {
    generate(dataYaml, styleYaml);
  };

  const handleDownload = () => {
    if (!svg) return;
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "chart.svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app-layout">
      <Header />
      <div className="main-content">
        <div className="left-panel">
          <YamlEditor
            label="Data YAML"
            value={dataYaml}
            onChange={setDataYaml}
            error={dataError}
            rows={18}
          />
          <YamlEditor
            label="Style YAML"
            value={styleYaml}
            onChange={setStyleYaml}
            error={styleError}
            rows={8}
          />
        </div>
        <div className="right-panel">
          <SvgPreview svgString={svg} />
        </div>
      </div>
      <Toolbar
        onGenerate={handleGenerate}
        onDownload={handleDownload}
        canDownload={svg !== null}
      />
    </div>
  );
}
