import Ajv, { type ErrorObject } from "ajv";
import type { BandData, StyleConfig } from "@shared/types";

import bandDataSchema from "@shared/schema/band.data.schema.yaml";
import bandStyleSchema from "@shared/schema/band.style.schema.yaml";

const ajv = new Ajv({ allErrors: true });

const validateData = ajv.compile(bandDataSchema);
const validateStyle = ajv.compile(bandStyleSchema);

function formatErrors(errors: ErrorObject[] | null | undefined): string {
  if (!errors) return "不明なエラー";
  return errors
    .map((e: ErrorObject) => {
      const path = e.instancePath || "(root)";
      return `${path}: ${e.message}`;
    })
    .join("\n  ");
}

export function validateBandData(data: unknown): asserts data is BandData {
  if (!validateData(data)) {
    throw new ValidationError(
      `データのバリデーションエラー:\n  ${formatErrors(validateData.errors)}`
    );
  }
}

export function validateStyleConfig(
  data: unknown
): asserts data is StyleConfig {
  if (!validateStyle(data)) {
    throw new ValidationError(
      `スタイルのバリデーションエラー:\n  ${formatErrors(validateStyle.errors)}`
    );
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}
