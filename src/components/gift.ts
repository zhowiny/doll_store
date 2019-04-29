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
  rate: number = 0.2
  resetting: boolean = false
  maxAngle: number = Math.floor(Math.random() * 30)
  collideArea: number = 0


  constructor(public position: Position, public hook: Hook) {
    super()
    this.initialPosition = Object.assign({}, this.position)
  }

  draw(): void {
    if (this.isDead) return

    let hook = {
      x: this.hook.x,
      y: this.hook.y + this.hook.startY - 15 * this.ratio,
      width: this.hook.width,
      height: this.hook.height,
    }

    this.collideArea = utils.calcArea(this.position, hook)
    this.collide = this.collideArea > 0.2
    this.isTarget = this.collideArea > 0.65 || this.isTarget

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

  move(fn?: () => void): void {
    if (this.resetting) {
      this.reset(fn)
    } else {
      this.horizontalMove()
      this.verticalMove()
      this.rotate()
    }
    // this.draw()

  }

  horizontalMove(): void {
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

  verticalMove(): void {
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

  rotate(): void {
    let condition = 1

    if (this.hook.x + this.hook.width / 2 > this.initialPosition.x + this.initialPosition.width / 2) {
      condition = -1
    }

    if (Math.abs(this.angle) < this.maxAngle) {
      this.angle = (Math.abs(this.angle) + 1) * condition
    }
  }

  reset(fn?: () => void): void {
    this.resetting = true
    let xArrived = this.resetHorizonal(this.initialPosition.x)
    let yArrived = this.resetVertical(this.initialPosition.y)
    if (xArrived && yArrived) {
      this.resetting = false
      this.isTarget = false
      this.Xarrived = false
      this.Yarrived = false
      Math.abs(this.angle) > 360 && (this.angle = this.angle % 360)
      fn && fn()
    }
    this.randomAngle()
  }

  resetHorizonal(x: number): boolean {
    let g = this.position
    let speed = 2
    if (Math.abs(x - g.x) > 10) speed = 10

    if (g.x < x) {
      g.x += speed
      g.x = Math.min(g.x, x)
    } else {
      g.x -= speed
      g.x = Math.max(g.x, x)
    }
    return g.x === x
  }
  resetVertical(y: number): boolean {
    let g = this.position

    if (g.y < y) {
      g.y += 35
      g.y = Math.min(g.y, y)
    } else {
      g.y -= 35
      g.y = Math.max(g.y, y)
    }
    return g.y === y
  }
  randomAngle(): void {
    if (!this.resetting) return
    let angle = Math.abs(this.angle)
    let condition = this.angle / angle
    let speed = 20

    angle += (Math.random() * speed + (speed - 15))
    this.angle = angle * condition
  }

  destroy(): void {
    this.isDead = true
  }
}