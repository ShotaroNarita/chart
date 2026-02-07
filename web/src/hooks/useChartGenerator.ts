import { useState, useCallback } from "react";
import yaml from "js-yaml";
import { generateBandChart } from "@shared/charts/band";
import {
  validateBandData,
  validateStyleConfig,
  ValidationError,
} from "../lib/validate-browser";

interface ChartGeneratorResult {
  svg: string | null;
  dataError: string | null;
  styleError: string | null;
  generate: (dataYaml: string, styleYaml: string) => void;
}

export function useChartGenerator(): ChartGeneratorResult {
  const [svg, setSvg] = useState<string | null>(null);
  const [dataError, setDataError] = useState<string | null>(null);
  const [styleError, setStyleError] = useState<string | null>(null);

  const generate = useCallback((dataYaml: string, styleYaml: string) => {
    setDataError(null);
    setStyleError(null);
    setSvg(null);

    let rawData: unknown;
    try {
      rawData = yaml.load(dataYaml);
    } catch (e) {
      setDataError(`YAML parse error: ${(e as Error).message}`);
      return;
    }

    let rawStyle: unknown;
    try {
      rawStyle = yaml.load(styleYaml);
    } catch (e) {
      setStyleError(`YAML parse error: ${(e as Error).message}`);
      return;
    }

    try {
      validateBandData(rawData);
    } catch (e) {
      if (e instanceof ValidationError) {
        setDataError(e.message);
        return;
      }
      throw e;
    }

    try {
      validateStyleConfig(rawStyle);
    } catch (e) {
      if (e instanceof ValidationError) {
        setStyleError(e.message);
        return;
      }
      throw e;
    }

    const result = generateBandChart(rawData, rawStyle);
    setSvg(result);
  }, []);

  return { svg, dataError, styleError, generate };
}
