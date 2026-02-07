import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import { generateBandChart } from "../charts/band.js";
import type { BandData, StyleConfig } from "../types.js";

interface GenerateOptions {
  type: string;
  source: string;
  style: string;
}

export function generate(options: GenerateOptions): void {
  const { type, source, style } = options;

  const sourceContent = fs.readFileSync(source, "utf-8");
  const data = yaml.load(sourceContent) as BandData;

  const styleContent = fs.readFileSync(style, "utf-8");
  const styleConfig = yaml.load(styleContent) as StyleConfig;

  let svg: string;
  switch (type) {
    case "band":
      svg = generateBandChart(data, styleConfig);
      break;
    default:
      console.error(`Unknown chart type: ${type}`);
      process.exit(1);
  }

  const outputPath = path.join(
    path.dirname(source),
    path.basename(source, path.extname(source)) + ".svg"
  );
  fs.writeFileSync(outputPath, svg, "utf-8");
  console.log(`Generated: ${outputPath}`);
}
