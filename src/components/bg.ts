interface Position {
  x: number,
  y: number,
  width: number,
  height: number,
  img: HTMLImageElement,
}

import Base from './base'


export default class Background extends Base {
  position: Position | null = null
  constructor(public img: HTMLImageElement) {
    super()
    this.position = {
      x: 0,
      y: 0,
      width: (<HTMLCanvasElement>this.canvas).width,
      height: (<HTMLCanvasElement>this.canvas).width * (this.img.height / this.img.width),
      img: img,
    }
  }
  draw(): void {
    this.drawBg()
  }
  drawBg(): void {
    const position = <Position>this.position
    const ctx = <CanvasRenderingContext2D>this.context
    const canvas = <HTMLCanvasElement>this.canvas
    ctx.beginPath()
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(this.img, position.x, position.y, position.width, position.height)
  }
}