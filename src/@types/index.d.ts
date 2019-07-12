declare function require(path: string): any

interface GiftImage {
  name: string;
  path: any;
}

interface Resource {
  [name: string]: HTMLImageElement
}

interface Rect {
  x: number
  y: number
  width: number
  height: number
  [prop: string]: any
}

