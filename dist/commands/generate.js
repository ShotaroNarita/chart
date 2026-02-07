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
function generate(options) {
    const { type, source, style } = options;
    const sourceContent = node_fs_1.default.readFileSync(source, "utf-8");
    const data = js_yaml_1.default.load(sourceContent);
    const styleContent = node_fs_1.default.readFileSync(style, "utf-8");
    const styleConfig = js_yaml_1.default.load(styleContent);
    let svg;
    switch (type) {
        case "band":
            svg = (0, band_js_1.generateBandChart)(data, styleConfig);
            break;
        default:
            console.error(`Unknown chart type: ${type}`);
            process.exit(1);
    }
    const outputPath = node_path_1.default.join(node_path_1.default.dirname(source), node_path_1.default.basename(source, node_path_1.default.extname(source)) + ".svg");
    node_fs_1.default.writeFileSync(outputPath, svg, "utf-8");
    console.log(`Generated: ${outputPath}`);
}
