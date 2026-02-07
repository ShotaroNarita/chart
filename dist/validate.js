"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = void 0;
exports.validateBandData = validateBandData;
exports.validateStyleConfig = validateStyleConfig;
function validateBandData(data) {
    if (data == null || typeof data !== "object") {
        throw new ValidationError("データがオブジェクトではありません");
    }
    const obj = data;
    if (obj.title !== undefined && typeof obj.title !== "string") {
        throw new ValidationError("title は文字列である必要があります");
    }
    if (obj.unit !== undefined && typeof obj.unit !== "string") {
        throw new ValidationError("unit は文字列である必要があります");
    }
    if (!Array.isArray(obj.rows)) {
        throw new ValidationError("rows は必須の配列フィールドです");
    }
    if (obj.rows.length === 0) {
        throw new ValidationError("rows には1つ以上の要素が必要です");
    }
    for (let i = 0; i < obj.rows.length; i++) {
        const row = obj.rows[i];
        const prefix = `rows[${i}]`;
        if (row == null || typeof row !== "object") {
            throw new ValidationError(`${prefix} はオブジェクトである必要があります`);
        }
        if (typeof row.name !== "string") {
            throw new ValidationError(`${prefix}.name は必須の文字列フィールドです`);
        }
        if (!Array.isArray(row.segments)) {
            throw new ValidationError(`${prefix}.segments は必須の配列フィールドです`);
        }
        if (row.segments.length === 0) {
            throw new ValidationError(`${prefix}.segments には1つ以上の要素が必要です`);
        }
        for (let j = 0; j < row.segments.length; j++) {
            const seg = row.segments[j];
            const segPrefix = `${prefix}.segments[${j}]`;
            if (seg == null || typeof seg !== "object") {
                throw new ValidationError(`${segPrefix} はオブジェクトである必要があります`);
            }
            if (typeof seg.label !== "string") {
                throw new ValidationError(`${segPrefix}.label は必須の文字列フィールドです`);
            }
            if (typeof seg.value !== "number" || seg.value < 0) {
                throw new ValidationError(`${segPrefix}.value は0以上の数値である必要があります`);
            }
        }
    }
}
function validateStyleConfig(data) {
    if (data == null || typeof data !== "object") {
        throw new ValidationError("スタイルがオブジェクトではありません");
    }
    const obj = data;
    if (!Array.isArray(obj.colors)) {
        throw new ValidationError("colors は必須の配列フィールドです");
    }
    for (let i = 0; i < obj.colors.length; i++) {
        const cm = obj.colors[i];
        const prefix = `colors[${i}]`;
        if (cm == null || typeof cm !== "object") {
            throw new ValidationError(`${prefix} はオブジェクトである必要があります`);
        }
        if (typeof cm.label !== "string") {
            throw new ValidationError(`${prefix}.label は必須の文字列フィールドです`);
        }
        if (typeof cm.color !== "string") {
            throw new ValidationError(`${prefix}.color は必須の文字列フィールドです`);
        }
    }
}
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "ValidationError";
    }
}
exports.ValidationError = ValidationError;
