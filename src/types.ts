export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };
