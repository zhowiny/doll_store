interface Position {
  x: number
  y: number
  width: number
  height: number
  img: HTMLImageElement
  [props: string]: any
}

import Base from "./base";
import Hook from "./hook";


export default class Gift extends Base {
  canvas: HTMLCanvasElement = this.canvas
  context: CanvasRenderingContext2D = this.context
  name: string = this.position.imgName
  isTarget: boolean = false
  initialPosition: Position
  Yarrived: boolean = false
  Xarrived: boolean = false
  angle: number = 0
  isDead: boolean = false

  constructor(public position: Position, public hook: Hook) {
    super()
    this.initialPosition = Object.assign({}, this.position)
  }

  draw() {
    if (this.isDead) return

    let hook = {
      x: this.hook.x,
      y: this.hook.y + this.hook.startY - 15 * this.ratio,
      width: this.hook.width,
      height: this.hook.height,
    }
    this.isTarget = (this.calcArea(this.position, hook))

    this.context.beginPath()
    this.context.save()
    this.context.translate(
      this.position.x + this.position.width / 2,
      this.position.y + this.position.height / 2
    )
    this.context.rotate(Math.PI * 2 / 360 * this.angle)
    this.context.drawImage(
      this.position.img,
      -this.position.width / 2,
      -this.position.height / 2,
      this.position.width,
      this.position.height
    )
    this.context.closePath()
    this.context.restore()
  }

  move() {

    this.horizontalMove()
    this.verticalMove()
    this.rotate()
    // this.draw()

  }

  horizontalMove() {
    let g = this.position
    let h = this.hook
    let i = this.initialPosition
    let x = (h.x + h.width / 2) - (i.width / 2)

    if (this.Xarrived) {
      g.x = x
      return
    }

    g.x === x && (this.Xarrived = true)

    if (g.x < x) {
      g.x += 2
      if (g.x > x) {
        g.x = x
        this.Xarrived = true
      }
    } else {
      g.x -= 2
      if (g.x < x) {
        g.x = x
        this.Xarrived = true
      }
    }
  }

  verticalMove() {
    let g = this.position
    let h = this.hook
    let i = this.initialPosition
    let y = (h.y + h.startY - 15 * this.ratio + h.height / 2) - (i.height / 3)

    if (this.Yarrived) {
      g.y = y
      return
    }
    g.y === y && (this.Yarrived = true)

    if (g.y > y) {
      g.y -= 2
      if (g.y < y) {
        g.y = y
        this.Yarrived = true
      }
    } else {
      g.y += 2
      if (g.y > y) {
        g.y = y
        this.Yarrived = true
      }
    }
  }

  maxAngle: number = Math.floor(Math.random() * 30)
  rotate() {
    let condition = 1

    if (this.hook.x + this.hook.width / 2 > this.initialPosition.x + this.initialPosition.width / 2) {
      condition = -1
    }

    if (Math.abs(this.angle) < this.maxAngle) {
      this.angle = (Math.abs(this.angle) + 1) * condition
    }
  }

  destroy() {
    this.isDead = true
  }
}