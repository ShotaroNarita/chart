"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateBandChart = generateBandChart;
// 和風カラーパレット
const WAFU_COLORS = [
    "#C53D43", // 紅色 (べにいろ)
    "#2E4F8F", // 瑠璃紺 (るりこん)
    "#68975C", // 若竹色 (わかたけいろ)
    "#E8B647", // 山吹色 (やまぶきいろ)
    "#7A4171", // 二藍 (ふたあい)
    "#2D6D6B", // 青碧 (せいへき)
    "#C47756", // 柿色 (かきいろ)
    "#5B7E91", // 藍鼠 (あいねず)
    "#A8497A", // 牡丹色 (ぼたんいろ)
    "#8D6449", // 胡桃色 (くるみいろ)
    "#4D6E50", // 千歳緑 (ちとせみどり)
    "#D4A168", // 芥子色 (からしいろ)
];
function hashLabel(label) {
    let hash = 0;
    for (let i = 0; i < label.length; i++) {
        hash = (hash * 31 + label.charCodeAt(i)) | 0;
    }
    return Math.abs(hash);
}
const PADDING = 40;
const BAR_HEIGHT = 36;
const BAR_GAP = 16;
const LABEL_WIDTH = 80;
const CHART_WIDTH = 500;
const LEGEND_ITEM_WIDTH = 100;
const LEGEND_HEIGHT = 30;
const TITLE_HEIGHT = 36;
const FONT_FAMILY = "sans-serif";
function escapeXml(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}
function buildColorMap(data, style) {
    const colorMap = new Map();
    // Hash-based assignment from WAFU_COLORS for all labels
    for (const row of data.rows) {
        for (const seg of row.segments) {
            if (!colorMap.has(seg.label)) {
                colorMap.set(seg.label, WAFU_COLORS[hashLabel(seg.label) % WAFU_COLORS.length]);
            }
        }
    }
    // Style overrides
    for (const cm of style.colors) {
        colorMap.set(cm.label, cm.color);
    }
    return colorMap;
}
function generateBandChart(data, style) {
    const colorMap = buildColorMap(data, style);
    // Collect unique labels in order of appearance for the legend
    const legendLabels = [];
    for (const row of data.rows) {
        for (const seg of row.segments) {
            if (!legendLabels.includes(seg.label)) {
                legendLabels.push(seg.label);
            }
        }
    }
    // Calculate max total value across all rows for scaling
    const maxTotal = Math.max(...data.rows.map((r) => r.segments.reduce((sum, s) => sum + s.value, 0)));
    const hasTitle = !!data.title;
    const titleAreaHeight = hasTitle ? TITLE_HEIGHT : 0;
    const barsAreaHeight = data.rows.length * BAR_HEIGHT + (data.rows.length - 1) * BAR_GAP;
    const legendRows = Math.ceil(legendLabels.length / Math.floor((LABEL_WIDTH + CHART_WIDTH) / LEGEND_ITEM_WIDTH));
    const totalHeight = PADDING + titleAreaHeight + barsAreaHeight + PADDING + legendRows * LEGEND_HEIGHT + PADDING;
    const totalWidth = PADDING + LABEL_WIDTH + CHART_WIDTH + PADDING;
    const lines = [];
    lines.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${totalHeight}" viewBox="0 0 ${totalWidth} ${totalHeight}">`);
    lines.push(`<rect width="${totalWidth}" height="${totalHeight}" fill="white"/>`);
    let yOffset = PADDING;
    // Title
    if (hasTitle) {
        const titleText = data.unit
            ? `${data.title}（${data.unit}）`
            : data.title;
        lines.push(`<text x="${totalWidth / 2}" y="${yOffset + 4}" text-anchor="middle" font-size="16" font-weight="bold" font-family="${FONT_FAMILY}" fill="#1f2937">${escapeXml(titleText)}</text>`);
        yOffset += TITLE_HEIGHT;
    }
    // Bars
    for (const row of data.rows) {
        const rowTotal = row.segments.reduce((sum, s) => sum + s.value, 0);
        // Row label
        lines.push(`<text x="${PADDING + LABEL_WIDTH - 8}" y="${yOffset + BAR_HEIGHT / 2 + 5}" text-anchor="end" font-size="13" font-family="${FONT_FAMILY}" fill="#374151">${escapeXml(row.name)}</text>`);
        // Segments
        let xOffset = PADDING + LABEL_WIDTH;
        for (const seg of row.segments) {
            const segWidth = (seg.value / maxTotal) * CHART_WIDTH;
            const color = colorMap.get(seg.label) ?? "#94a3b8";
            lines.push(`<rect x="${xOffset}" y="${yOffset}" width="${segWidth}" height="${BAR_HEIGHT}" fill="${escapeXml(color)}" rx="2"/>`);
            // Value label inside the segment (only if wide enough)
            if (segWidth > 30) {
                lines.push(`<text x="${xOffset + segWidth / 2}" y="${yOffset + BAR_HEIGHT / 2 + 5}" text-anchor="middle" font-size="12" font-family="${FONT_FAMILY}" fill="white">${seg.value}</text>`);
            }
            xOffset += segWidth;
        }
        // Row total on the right
        lines.push(`<text x="${xOffset + 6}" y="${yOffset + BAR_HEIGHT / 2 + 5}" text-anchor="start" font-size="12" font-family="${FONT_FAMILY}" fill="#6b7280">${rowTotal}</text>`);
        yOffset += BAR_HEIGHT + BAR_GAP;
    }
    // Legend
    yOffset += PADDING / 2;
    const legendStartX = PADDING + LABEL_WIDTH;
    let lx = legendStartX;
    let ly = yOffset;
    for (const label of legendLabels) {
        if (lx + LEGEND_ITEM_WIDTH > totalWidth - PADDING) {
            lx = legendStartX;
            ly += LEGEND_HEIGHT;
        }
        const color = colorMap.get(label) ?? "#94a3b8";
        lines.push(`<rect x="${lx}" y="${ly}" width="14" height="14" fill="${escapeXml(color)}" rx="2"/>`);
        lines.push(`<text x="${lx + 20}" y="${ly + 12}" font-size="12" font-family="${FONT_FAMILY}" fill="#374151">${escapeXml(label)}</text>`);
        lx += LEGEND_ITEM_WIDTH;
    }
    lines.push("</svg>");
    return lines.join("\n");
}
