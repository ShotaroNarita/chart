#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const generate_js_1 = require("./commands/generate.js");
const program = new commander_1.Command();
program
    .name("miomonchart")
    .description("CLI tool for generating chart SVGs from YAML data")
    .version("0.1.0");
program
    .command("generate")
    .description("Generate an SVG chart from YAML data")
    .requiredOption("--type <type>", "Chart type (e.g., band)")
    .requiredOption("--source <path>", "Path to data YAML file")
    .requiredOption("--style <path>", "Path to style YAML file")
    .action(generate_js_1.generate);
program.parse();
