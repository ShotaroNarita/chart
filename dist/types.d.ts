export interface Segment {
    label: string;
    value: number;
}
export interface Row {
    name: string;
    segments: Segment[];
}
export interface BandData {
    title?: string;
    unit?: string;
    rows: Row[];
}
export interface ColorMapping {
    label: string;
    color: string;
}
export interface StyleConfig {
    colors: ColorMapping[];
}
