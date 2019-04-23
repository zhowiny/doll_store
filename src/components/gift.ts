interface Position {
  x: number,
  y: number,
  width: number,
  height: number,
  img: HTMLImageElement,
}

import Base from "./base";
import Hook from "./hook";


export default class Gift extends Base {
  canvas: HTMLCanvasElement = this.canvas
  context: CanvasRenderingContext2D = this.context
  constructor(public position: Position, public hook: Hook) {
    super()
  }

  draw() {
    this.context.beginPath()
    this.context.drawImage(
      this.position.img,
      this.position.x,
      this.position.y,
      this.position.width,
      this.position.height
    )
    this.context.closePath()
  }
}