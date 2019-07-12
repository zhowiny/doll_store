import Base from "./base";
import { utils } from '../utils'
import Gift from "./gift";

export default class Hook extends Base {
  startX: number = 25 * this.ratio
  startY: number = 60 * this.ratio
  width: number = 70 * this.ratio
  height: number = 105 * this.ratio
  x: number = 0
  y: number = 0
  angle: number = 0

  speed: number = 30
  stop: boolean = false

  constructor(public img: HTMLImageElement) {
    super()
  }
  draw(): void {
    this.render()
  }

  render(): void {

    this.drawPeople()
    this.drawPeople('right')

    this.drawLine()

    this.roundedRect(
      this.startX + this.x + 5 * this.ratio,
      this.startY - 15 * this.ratio,
      10 * this.ratio,
      30 * this.ratio,
      5 * this.ratio
    )

    this.drawClaw()
    this.drawClaw('right')

    this.drawRope()


  }

  moveLeft(): void {
    this.x -= this.speed
    this.x = Math.max(0, this.x)
  }
  moveRight(): void {
    const canvas = <HTMLCanvasElement>this.canvas
    this.x += this.speed
    this.x = Math.min(this.x, canvas.width - 45 * this.ratio - this.startX)
  }
  open(fn?: () => void): void {
    this.angle += 0.5
    this.angle = Math.min(this.angle, 15)
    if (this.angle === 15) {
      fn && fn()
    }
  }
  catch(fn?: () => void): void {
    this.angle -= 1.5
    this.angle = Math.max(this.angle, -10)
    if (this.angle === -10) {
      // this.drag(fn)
      fn && fn()
    }
  }
  drop(gift?: Gift, fn?: Function): void {
    const canvas = <HTMLCanvasElement>this.canvas
    let bound = canvas.height - this.height - this.startY + 80
    if (gift) {
      bound = gift.initialPosition.y + gift.initialPosition.height - this.height - this.startY + 80
    }
    this.y += 5 * this.ratio
    this.y = Math.min(this.y, bound)
    if (this.y === bound) {
      this.y = bound
      fn && fn()
    }
  }
  drag(fn?: Function): void {
    this.y -= 5 * this.ratio
    this.y = Math.max(this.y, 0)
    if (this.y === 0) {
      fn && fn()
    }
  }

  reset(fn?: Function): void {
    if (this.resetX() && this.resetY() && this.resetAngle()) {
      fn && fn()
    }
  }

  resetX(): boolean {
    this.x -= 3 * this.ratio
    this.x = Math.max(0, this.x)
    return this.x === 0
  }
  resetY(): boolean {
    this.y -= 5 * this.ratio
    this.y = Math.max(this.y, 0)
    return this.y === 0
  }
  resetAngle(): boolean {
    this.angle += 0.3
    this.angle = Math.min(this.angle, 0)
    return this.angle === 0
  }

  drawPeople(position: string = 'left'): void {
    const canvas = <HTMLCanvasElement>this.canvas
    const ctx = <CanvasRenderingContext2D>this.context
    const size = 30 * this.ratio
    let originX = 15 * this.ratio, originY = this.startY
    let angle = 120

    if (position === 'right') {
      originX = canvas.width - originX
      angle *= -1
    }
    ctx.save()
    ctx.beginPath()
    ctx.translate(originX, originY)
    ctx.rotate(Math.PI * 2 / 360 * angle)
    ctx.drawImage(this.img, -size / 2, - size / 2, size, size)
    ctx.restore()
  }
  drawClaw(position: string = 'left'): void {
    const ctx = <CanvasRenderingContext2D>this.context
    let condition = -1
    let x = this.startX + this.x + 10 * this.ratio
    let y = this.startY + this.y + 15 * this.ratio

    if (position === 'right') {
      condition *= -1
    }

    ctx.beginPath()
    ctx.save()
    ctx.lineWidth = 1 * this.ratio
    ctx.translate(x, y)
    ctx.rotate(Math.PI * 2 / 360 * this.angle * -condition)
    ctx.fillStyle = 'rgba(154,154,154,.9)'
    ctx.moveTo(condition * 5 * this.ratio, -1 * this.ratio)
    ctx.lineTo(condition * 35 * this.ratio, 25 * this.ratio)
    ctx.lineTo(condition * 10 * this.ratio, 75 * this.ratio)
    ctx.lineTo(condition * 27 * this.ratio, 25 * this.ratio)
    ctx.lineTo(0, 0)
    ctx.fill()
    ctx.restore()
  }
  drawLine(): void {
    const canvas = <HTMLCanvasElement>this.canvas
    const ctx = <CanvasRenderingContext2D>this.context
    const ratio = this.ratio
    ctx.save()
    ctx.beginPath()
    ctx.lineWidth = 2 * ratio
    ctx.strokeStyle = '#666'
    ctx.translate(this.startX, this.startY)
    ctx.moveTo(0, 0)
    ctx.lineTo(canvas.width - this.startX * 2, 0)
    ctx.stroke()
    ctx.restore()
  }
  drawRope(): void {
    const ctx = <CanvasRenderingContext2D>this.context
    let x = this.startX + this.x - 45 * this.ratio
    let y = this.startY + this.y - 15 * this.ratio
    // hook line
    ctx.beginPath()
    ctx.save()
    ctx.translate(35 * this.ratio, 15 * this.ratio)

    ctx.drawImage(this.img, x, y, 50 * this.ratio, 50 * this.ratio)
    ctx.lineWidth = 2 * this.ratio
    ctx.moveTo(this.x, this.startY)
    ctx.lineTo(this.x, this.y + this.startY)
    ctx.stroke()
    ctx.restore()
  }
}