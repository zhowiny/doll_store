import Base from "./base";
import { utils } from '../utils'

export default class Hook extends Base {
  startX: number = 25 * this.ratio
  startY: number = 60 * this.ratio
  width: number = 70 * this.ratio
  height: number = 105 * this.ratio
  x: number = 0
  y: number = 0
  angle: number = 0

  constructor(public img: HTMLImageElement) {
    super()
    // this.render()
    // this.addEvent('touchstart', (e: any) => {
    //   console.log(e)
    //   console.log(this)
    // })
  }
  draw() {
    this.render()
  }

  render() {

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

  moveLeft() {
    this.x -= 3 * this.ratio
    this.x = Math.max(0, this.x)
  }
  moveRight() {
    const canvas = <HTMLCanvasElement>this.canvas
    this.x += 3 * this.ratio
    this.x = Math.min(this.x, canvas.width - 45 * this.ratio - this.startX)
  }
  open() {
    return new Promise(async (resolve, reject) => {
      this.angle += 1
      this.angle = Math.min(this.angle, 30)
      if (this.angle === 30) {
        resolve()
      }
    })
  }
  catch() {
    return new Promise(async (resolve, reject) => {
      this.angle -= 1
      this.angle = Math.max(this.angle, -10)
      if (this.angle === -10) {
        await this.sleep(500)
        await this.drag()
        resolve()
      }
    })
  }
  drop() {
    return new Promise(async (resolve, reject) => {
      const canvas = <HTMLCanvasElement>this.canvas
      this.y += 5 * this.ratio
      this.y = Math.min(this.y, canvas.height / 4 * 3 - this.startY)
      if (this.y === canvas.height / 4 * 3 - this.startY) {
        await this.open()
        resolve()
      }
    })
  }
  drag() {
    return new Promise((resolve, reject) => {
      this.y -= 5 * this.ratio
      this.y = Math.max(this.y, 0)
      if (this.y === 0) {
        resolve()
      }
    })
  }

  sleep(time: number) {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, time)
    })
  }

  reset() {
    return new Promise((resolve, reject) => {
      // this.y -= 5 * this.ratio
      // this.y = Math.max(this.y, 0)
      // this.angle += 0.5
      // this.angle = Math.min(this.angle, 0)
      this.x -= 3 * this.ratio
      this.x = Math.max(0, this.x)

      // if (this.x === 0 && this.y === 0 && this.angle === 0) {
      //   resolve()
      // }
      if (this.x === 0) {
        resolve()
      }
    })
  }

  drawPeople(position: string = 'left') {
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
  drawClaw(position: string = 'left') {
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
    ctx.strokeStyle = '#666'
    ctx.moveTo(condition * 5 * this.ratio, -1 * this.ratio)
    ctx.lineTo(condition * 35 * this.ratio, 25 * this.ratio)
    ctx.lineTo(condition * 10 * this.ratio, 75 * this.ratio)
    ctx.lineTo(condition * 27 * this.ratio, 25 * this.ratio)
    ctx.lineTo(0, 0)
    ctx.stroke()
    ctx.restore()
  }
  drawLine() {
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
  drawRope() {
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