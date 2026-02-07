import { describe, it, expect } from "vitest";
import {
  validateBandData,
  validateStyleConfig,
  ValidationError,
} from "./validate.js";

describe("validateBandData", () => {
  const validData = {
    title: "テスト",
    unit: "億円",
    rows: [
      {
        name: "2024年",
        segments: [{ label: "A", value: 1 }],
      },
    ],
  };

  it("有効なデータはエラーを投げない", () => {
    expect(() => validateBandData(validData)).not.toThrow();
  });

  it("title・unit省略でも有効", () => {
    expect(() =>
      validateBandData({ rows: [{ name: "r", segments: [{ label: "A", value: 0 }] }] })
    ).not.toThrow();
  });

  it("nullを拒否する", () => {
    expect(() => validateBandData(null)).toThrow(ValidationError);
  });

  it("文字列を拒否する", () => {
    expect(() => validateBandData("hello")).toThrow(ValidationError);
  });

  it("titleが文字列でない場合を拒否する", () => {
    expect(() =>
      validateBandData({ title: 123, rows: [{ name: "r", segments: [{ label: "A", value: 1 }] }] })
    ).toThrow(ValidationError);
  });

  it("rowsが無い場合を拒否する", () => {
    expect(() => validateBandData({})).toThrow(ValidationError);
  });

  it("rowsが配列でない場合を拒否する", () => {
    expect(() => validateBandData({ rows: "not array" })).toThrow(ValidationError);
  });

  it("rowsが空配列の場合を拒否する", () => {
    expect(() => validateBandData({ rows: [] })).toThrow(ValidationError);
  });

  it("row.nameが無い場合を拒否する", () => {
    expect(() =>
      validateBandData({ rows: [{ segments: [{ label: "A", value: 1 }] }] })
    ).toThrow(ValidationError);
  });

  it("row.segmentsが無い場合を拒否する", () => {
    expect(() =>
      validateBandData({ rows: [{ name: "r" }] })
    ).toThrow(ValidationError);
  });

  it("row.segmentsが空配列の場合を拒否する", () => {
    expect(() =>
      validateBandData({ rows: [{ name: "r", segments: [] }] })
    ).toThrow(ValidationError);
  });

  it("segment.labelが無い場合を拒否する", () => {
    expect(() =>
      validateBandData({ rows: [{ name: "r", segments: [{ value: 1 }] }] })
    ).toThrow(ValidationError);
  });

  it("segment.valueが数値でない場合を拒否する", () => {
    expect(() =>
      validateBandData({ rows: [{ name: "r", segments: [{ label: "A", value: "x" }] }] })
    ).toThrow(ValidationError);
  });

  it("segment.valueが負の場合を拒否する", () => {
    expect(() =>
      validateBandData({ rows: [{ name: "r", segments: [{ label: "A", value: -1 }] }] })
    ).toThrow(ValidationError);
  });

  it("エラーメッセージにJSON Schemaのパスが含まれる", () => {
    try {
      validateBandData({
        rows: [
          { name: "r1", segments: [{ label: "A", value: 1 }] },
          { name: "r2", segments: [{ label: "B", value: -5 }] },
        ],
      });
      expect.unreachable("should have thrown");
    } catch (e) {
      expect(e).toBeInstanceOf(ValidationError);
      expect((e as ValidationError).message).toContain("/rows/1/segments/0/value");
    }
  });

  it("未定義プロパティを拒否する (additionalProperties: false)", () => {
    expect(() =>
      validateBandData({
        rows: [{ name: "r", segments: [{ label: "A", value: 1 }] }],
        unknown: true,
      })
    ).toThrow(ValidationError);
  });
});

describe("validateStyleConfig", () => {
  it("有効なスタイルはエラーを投げない", () => {
    expect(() =>
      validateStyleConfig({ colors: [{ label: "A", color: "#ff0000" }] })
    ).not.toThrow();
  });

  it("空のcolors配列も有効", () => {
    expect(() => validateStyleConfig({ colors: [] })).not.toThrow();
  });

  it("nullを拒否する", () => {
    expect(() => validateStyleConfig(null)).toThrow(ValidationError);
  });

  it("colorsが無い場合を拒否する", () => {
    expect(() => validateStyleConfig({})).toThrow(ValidationError);
  });

  it("colors要素にlabelが無い場合を拒否する", () => {
    expect(() =>
      validateStyleConfig({ colors: [{ color: "#000000" }] })
    ).toThrow(ValidationError);
  });

  it("colors要素にcolorが無い場合を拒否する", () => {
    expect(() =>
      validateStyleConfig({ colors: [{ label: "A" }] })
    ).toThrow(ValidationError);
  });

  it("colorのパターンが不正な場合を拒否する", () => {
    expect(() =>
      validateStyleConfig({ colors: [{ label: "A", color: "#GGG" }] })
    ).toThrow(ValidationError);
  });

  it("未定義プロパティを拒否する", () => {
    expect(() =>
      validateStyleConfig({ colors: [], extra: 1 })
    ).toThrow(ValidationError);
  });
});
