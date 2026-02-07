import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import { generateBandChart } from "../charts/band.js";
import { validateBandData, validateStyleConfig, ValidationError, } from "../validate.js";
export function generate(options) {
    const { type, source, style } = options;
    if (!fs.existsSync(source)) {
        console.error(`Error: ファイルが見つかりません: ${source}`);
        process.exit(1);
    }
    if (!fs.existsSync(style)) {
        console.error(`Error: ファイルが見つかりません: ${style}`);
        process.exit(1);
    }
    let rawData;
    try {
        rawData = yaml.load(fs.readFileSync(source, "utf-8"));
    }
    catch (e) {
        console.error(`Error: ${source} のYAMLパースに失敗しました: ${e.message}`);
        process.exit(1);
    }
    let rawStyle;
    try {
        rawStyle = yaml.load(fs.readFileSync(style, "utf-8"));
    }
    catch (e) {
        console.error(`Error: ${style} のYAMLパースに失敗しました: ${e.message}`);
        process.exit(1);
    }
    try {
        validateBandData(rawData);
    }
    catch (e) {
        if (e instanceof ValidationError) {
            console.error(`Error: ${source} のバリデーションエラー: ${e.message}`);
            process.exit(1);
        }
        throw e;
    }
    try {
        validateStyleConfig(rawStyle);
    }
    catch (e) {
        if (e instanceof ValidationError) {
            console.error(`Error: ${style} のバリデーションエラー: ${e.message}`);
            process.exit(1);
        }
        throw e;
    }
    let svg;
    switch (type) {
        case "band":
            svg = generateBandChart(rawData, rawStyle);
            break;
        default:
            console.error(`Error: 未知のチャートタイプ: ${type}`);
            process.exit(1);
    }
    const outputPath = path.join(path.dirname(source), path.basename(source, path.extname(source)) + ".svg");
    fs.writeFileSync(outputPath, svg, "utf-8");
    console.log(`Generated: ${outputPath}`);
}
