#!/usr/bin/env node
import { Command } from "commander";
import { generate } from "./commands/generate.js";
const program = new Command();
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
    .action(generate);
program.parse();
