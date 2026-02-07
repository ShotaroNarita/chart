import type { BandData, StyleConfig } from "../types.js";
export declare function hashLabel(label: string): number;
export declare function buildColorMap(data: BandData, style: StyleConfig): Map<string, string>;
export declare function generateBandChart(data: BandData, style: StyleConfig): string;
