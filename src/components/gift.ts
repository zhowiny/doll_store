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
import { utils } from "../utils";


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
  collide: boolean = false
  rate: number = 0.5
  resetting: boolean = false
  maxAngle: number = Math.floor(Math.random() * 30)


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

    this.collide = utils.calcArea(this.position, hook) > 0.2
    this.isTarget = utils.calcArea(this.position, hook) > 0.65 || this.isTarget

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
    if (this.resetting) return

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

    if (g.x < x) {
      g.x += 5
      g.x = Math.min(g.x, x)
    } else {
      g.x -= 5
      g.x = Math.max(g.x, x)
    }
    g.x === x && (this.Xarrived = true)
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

    if (g.y > y) {
      g.y -= 2
      g.y = Math.max(g.y, y)
    } else {
      g.y += 2
      g.y = Math.min(g.y, y)
    }
    g.y === y && (this.Yarrived = true)
  }

  rotate() {
    let condition = 1

    if (this.hook.x + this.hook.width / 2 > this.initialPosition.x + this.initialPosition.width / 2) {
      condition = -1
    }

    if (Math.abs(this.angle) < this.maxAngle) {
      this.angle = (Math.abs(this.angle) + 1) * condition
    }
  }

  reset() {
    this.resetting = true
    let xArrived = this.resetHorizonal()
    let yArrived = this.resetVertical()
    let angleArrived = this.resetAngle()
    if (xArrived && yArrived) {
      this.resetting = false
      this.isTarget = false
      this.Xarrived = false
      this.Yarrived = false
      this.angle = this.angle % 360
    }
  }

  resetHorizonal() {
    let g = this.position
    let i = this.initialPosition

    if (g.x === i.x) return true
    if (g.x < i.x) {
      g.x += 2
      g.x = Math.min(g.x, i.x)
    } else {
      g.x -= 2
      g.x = Math.max(g.x, i.x)
    }
  }
  resetVertical() {
    let g = this.position
    let i = this.initialPosition

    if (g.y === i.y) return true
    if (g.y < i.y) {
      g.y += 20
      g.y = Math.min(g.y, i.y)
    } else {
      g.y -= 20
      g.y = Math.max(g.y, i.y)
    }
  }
  resetAngle() {
    let angle = Math.abs(this.angle)
    let condition = this.angle / angle
    if (Math.abs(angle % 360) === this.maxAngle && angle / 360 > 3) return true

    angle += (Math.random() * 15 + 5)
    angle = Math.min(angle, 360 * 3 + this.maxAngle)
    this.angle = angle * condition
  }

  destroy() {
    this.isDead = true
  }
}