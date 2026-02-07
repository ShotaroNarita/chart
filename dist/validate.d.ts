import type { BandData, StyleConfig } from "./types.js";
export declare function validateBandData(data: unknown): asserts data is BandData;
export declare function validateStyleConfig(data: unknown): asserts data is StyleConfig;
export declare class ValidationError extends Error {
    constructor(message: string);
}
