"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = generate;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const js_yaml_1 = __importDefault(require("js-yaml"));
const band_js_1 = require("../charts/band.js");
const validate_js_1 = require("../validate.js");
function generate(options) {
    const { type, source, style } = options;
    if (!node_fs_1.default.existsSync(source)) {
        console.error(`Error: ファイルが見つかりません: ${source}`);
        process.exit(1);
    }
    if (!node_fs_1.default.existsSync(style)) {
        console.error(`Error: ファイルが見つかりません: ${style}`);
        process.exit(1);
    }
    let rawData;
    try {
        rawData = js_yaml_1.default.load(node_fs_1.default.readFileSync(source, "utf-8"));
    }
    catch (e) {
        console.error(`Error: ${source} のYAMLパースに失敗しました: ${e.message}`);
        process.exit(1);
    }
    let rawStyle;
    try {
        rawStyle = js_yaml_1.default.load(node_fs_1.default.readFileSync(style, "utf-8"));
    }
    catch (e) {
        console.error(`Error: ${style} のYAMLパースに失敗しました: ${e.message}`);
        process.exit(1);
    }
    try {
        (0, validate_js_1.validateBandData)(rawData);
    }
    catch (e) {
        if (e instanceof validate_js_1.ValidationError) {
            console.error(`Error: ${source} のバリデーションエラー: ${e.message}`);
            process.exit(1);
        }
        throw e;
    }
    try {
        (0, validate_js_1.validateStyleConfig)(rawStyle);
    }
    catch (e) {
        if (e instanceof validate_js_1.ValidationError) {
            console.error(`Error: ${style} のバリデーションエラー: ${e.message}`);
            process.exit(1);
        }
        throw e;
    }
    let svg;
    switch (type) {
        case "band":
            svg = (0, band_js_1.generateBandChart)(rawData, rawStyle);
            break;
        default:
            console.error(`Error: 未知のチャートタイプ: ${type}`);
            process.exit(1);
    }
    const outputPath = node_path_1.default.join(node_path_1.default.dirname(source), node_path_1.default.basename(source, node_path_1.default.extname(source)) + ".svg");
    node_fs_1.default.writeFileSync(outputPath, svg, "utf-8");
    console.log(`Generated: ${outputPath}`);
}
