import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Ajv from "ajv";
import yaml from "js-yaml";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ajv = new Ajv.default({ allErrors: true });
function loadSchema(filename) {
    const schemaPath = path.resolve(__dirname, "schema", filename);
    const content = fs.readFileSync(schemaPath, "utf-8");
    return yaml.load(content);
}
const bandDataSchema = loadSchema("band.data.schema.yaml");
const bandStyleSchema = loadSchema("band.style.schema.yaml");
const validateData = ajv.compile(bandDataSchema);
const validateStyle = ajv.compile(bandStyleSchema);
function formatErrors(errors) {
    if (!errors)
        return "不明なエラー";
    return errors
        .map((e) => {
        const path = e.instancePath || "(root)";
        return `${path}: ${e.message}`;
    })
        .join("\n  ");
}
export function validateBandData(data) {
    if (!validateData(data)) {
        throw new ValidationError(`データのバリデーションエラー:\n  ${formatErrors(validateData.errors)}`);
    }
}
export function validateStyleConfig(data) {
    if (!validateStyle(data)) {
        throw new ValidationError(`スタイルのバリデーションエラー:\n  ${formatErrors(validateStyle.errors)}`);
    }
}
export class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "ValidationError";
    }
}
