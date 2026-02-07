import { describe, it, expect } from "vitest";
import { hashLabel, buildColorMap, generateBandChart } from "./band.js";
import type { BandData, StyleConfig } from "../types.js";

describe("hashLabel", () => {
  it("同一ラベルは常に同じハッシュ値を返す", () => {
    expect(hashLabel("A")).toBe(hashLabel("A"));
    expect(hashLabel("売上")).toBe(hashLabel("売上"));
  });

  it("異なるラベルは異なるハッシュ値を返す", () => {
    expect(hashLabel("A")).not.toBe(hashLabel("B"));
    expect(hashLabel("X")).not.toBe(hashLabel("Y"));
  });

  it("0以上の値を返す", () => {
    for (const label of ["A", "B", "テスト", "long-label-name", ""]) {
      expect(hashLabel(label)).toBeGreaterThanOrEqual(0);
    }
  });
});

describe("buildColorMap", () => {
  const baseData: BandData = {
    rows: [
      { name: "row1", segments: [{ label: "A", value: 1 }, { label: "B", value: 2 }] },
      { name: "row2", segments: [{ label: "A", value: 3 }, { label: "C", value: 4 }] },
    ],
  };

  it("全ラベルに色が割り当てられる", () => {
    const style: StyleConfig = { colors: [] };
    const map = buildColorMap(baseData, style);
    expect(map.has("A")).toBe(true);
    expect(map.has("B")).toBe(true);
    expect(map.has("C")).toBe(true);
  });

  it("ハッシュベースで同一ラベルには同一色が割り当てられる", () => {
    const style: StyleConfig = { colors: [] };
    const map1 = buildColorMap(baseData, style);

    const otherData: BandData = {
      rows: [
        { name: "別データ", segments: [{ label: "A", value: 99 }] },
      ],
    };
    const map2 = buildColorMap(otherData, style);

    expect(map1.get("A")).toBe(map2.get("A"));
  });

  it("styleで指定された色がハッシュ割り当てを上書きする", () => {
    const style: StyleConfig = {
      colors: [{ label: "A", color: "#ff0000" }],
    };
    const map = buildColorMap(baseData, style);
    expect(map.get("A")).toBe("#ff0000");
  });

  it("styleで指定されていないラベルはハッシュベースの色のまま", () => {
    const style: StyleConfig = {
      colors: [{ label: "A", color: "#ff0000" }],
    };
    const map = buildColorMap(baseData, style);
    // B and C should have hash-based colors (not #ff0000)
    expect(map.get("B")).not.toBe("#ff0000");
    expect(map.get("C")).not.toBe("#ff0000");
    expect(map.get("B")).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });
});

describe("generateBandChart", () => {
  const data: BandData = {
    title: "テスト",
    unit: "億円",
    rows: [
      {
        name: "2024年",
        segments: [
          { label: "X", value: 3 },
          { label: "Y", value: 2 },
        ],
      },
    ],
  };
  const style: StyleConfig = {
    colors: [{ label: "X", color: "#aabbcc" }],
  };

  it("有効なSVGを生成する", () => {
    const svg = generateBandChart(data, style);
    expect(svg).toMatch(/^<svg xmlns=/);
    expect(svg).toMatch(/<\/svg>$/);
  });

  it("タイトルと単位が含まれる", () => {
    const svg = generateBandChart(data, style);
    expect(svg).toContain("テスト（億円）");
  });

  it("タイトル省略時はtextが含まれない", () => {
    const noTitleData: BandData = {
      rows: [{ name: "row", segments: [{ label: "A", value: 1 }] }],
    };
    const svg = generateBandChart(noTitleData, { colors: [] });
    expect(svg).not.toContain("font-weight=\"bold\"");
  });

  it("行ラベルが含まれる", () => {
    const svg = generateBandChart(data, style);
    expect(svg).toContain("2024年");
  });

  it("styleで指定した色がSVGに反映される", () => {
    const svg = generateBandChart(data, style);
    expect(svg).toContain('fill="#aabbcc"');
  });

  it("凡例が含まれる", () => {
    const svg = generateBandChart(data, style);
    // Legend should have colored rects and label text
    const legendXCount = (svg.match(/>X</g) || []).length;
    const legendYCount = (svg.match(/>Y</g) || []).length;
    expect(legendXCount).toBeGreaterThanOrEqual(1);
    expect(legendYCount).toBeGreaterThanOrEqual(1);
  });

  it("セグメントの値がSVGに含まれる", () => {
    const svg = generateBandChart(data, style);
    expect(svg).toContain(">3<");
    expect(svg).toContain(">2<");
  });

  it("行の合計値が含まれる", () => {
    const svg = generateBandChart(data, style);
    expect(svg).toContain(">5<");
  });

  it("XMLの特殊文字がエスケープされる", () => {
    const specialData: BandData = {
      title: "A<B&C",
      rows: [{ name: 'R"1', segments: [{ label: "L>1", value: 1 }] }],
    };
    const svg = generateBandChart(specialData, { colors: [] });
    expect(svg).toContain("A&lt;B&amp;C");
    expect(svg).toContain("R&quot;1");
    expect(svg).toContain("L&gt;1");
  });
});
