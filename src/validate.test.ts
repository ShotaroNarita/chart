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
    expect(() => validateBandData(null)).toThrow("オブジェクトではありません");
  });

  it("文字列を拒否する", () => {
    expect(() => validateBandData("hello")).toThrow(ValidationError);
  });

  it("titleが文字列でない場合を拒否する", () => {
    expect(() => validateBandData({ title: 123, rows: [] })).toThrow("title は文字列");
  });

  it("unitが文字列でない場合を拒否する", () => {
    expect(() => validateBandData({ unit: true, rows: [] })).toThrow("unit は文字列");
  });

  it("rowsが無い場合を拒否する", () => {
    expect(() => validateBandData({})).toThrow("rows は必須");
  });

  it("rowsが配列でない場合を拒否する", () => {
    expect(() => validateBandData({ rows: "not array" })).toThrow("rows は必須の配列");
  });

  it("rowsが空配列の場合を拒否する", () => {
    expect(() => validateBandData({ rows: [] })).toThrow("1つ以上の要素が必要");
  });

  it("row.nameが無い場合を拒否する", () => {
    expect(() =>
      validateBandData({ rows: [{ segments: [{ label: "A", value: 1 }] }] })
    ).toThrow("rows[0].name は必須");
  });

  it("row.segmentsが無い場合を拒否する", () => {
    expect(() =>
      validateBandData({ rows: [{ name: "r" }] })
    ).toThrow("rows[0].segments は必須");
  });

  it("row.segmentsが空配列の場合を拒否する", () => {
    expect(() =>
      validateBandData({ rows: [{ name: "r", segments: [] }] })
    ).toThrow("rows[0].segments には1つ以上");
  });

  it("segment.labelが無い場合を拒否する", () => {
    expect(() =>
      validateBandData({ rows: [{ name: "r", segments: [{ value: 1 }] }] })
    ).toThrow("segments[0].label は必須");
  });

  it("segment.valueが数値でない場合を拒否する", () => {
    expect(() =>
      validateBandData({ rows: [{ name: "r", segments: [{ label: "A", value: "x" }] }] })
    ).toThrow("segments[0].value は0以上の数値");
  });

  it("segment.valueが負の場合を拒否する", () => {
    expect(() =>
      validateBandData({ rows: [{ name: "r", segments: [{ label: "A", value: -1 }] }] })
    ).toThrow("segments[0].value は0以上の数値");
  });

  it("2番目のrowのエラーにインデックスが含まれる", () => {
    expect(() =>
      validateBandData({
        rows: [
          { name: "r1", segments: [{ label: "A", value: 1 }] },
          { name: "r2", segments: [{ label: "B", value: -5 }] },
        ],
      })
    ).toThrow("rows[1].segments[0].value");
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
    expect(() => validateStyleConfig(null)).toThrow("オブジェクトではありません");
  });

  it("colorsが無い場合を拒否する", () => {
    expect(() => validateStyleConfig({})).toThrow("colors は必須");
  });

  it("colors要素にlabelが無い場合を拒否する", () => {
    expect(() =>
      validateStyleConfig({ colors: [{ color: "#000" }] })
    ).toThrow("colors[0].label は必須");
  });

  it("colors要素にcolorが無い場合を拒否する", () => {
    expect(() =>
      validateStyleConfig({ colors: [{ label: "A" }] })
    ).toThrow("colors[0].color は必須");
  });
});
