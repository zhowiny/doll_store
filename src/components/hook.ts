import Base from "./base";

export default class Hook extends Base {
  startX: number = 25 * this.ratio
  startY: number = 60 * this.ratio
  width: number = 70 * this.ratio
  height: number = 105 * this.ratio
  x: number = 30 * this.ratio
  y: number = 0
  angle: number = 0

  constructor(public img: HTMLImageElement) {
    super()
    this.render()
  }

  render() {

    this.drawPeople()
    this.drawPeople('right')

    this.drawLine()

    this.roundedRect(
      this.x,
      -15 * this.ratio,
      10 * this.ratio,
      30 * this.ratio,
      5 * this.ratio
    )

    this.drawClaw()
    this.drawClaw('right')

    this.drawRope()

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
    const hook = this
    let condition = -1

    if (position === 'right') {
      condition *= -1
    }

    ctx.beginPath()
    ctx.save()
    ctx.lineWidth = 1 * this.ratio
    ctx.translate(hook.x + 5 * this.ratio, hook.y + 15 * this.ratio)
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
    ctx.translate(0, this.startY)
    ctx.moveTo(25 * ratio, 0)
    ctx.lineTo(canvas.width - 25 * ratio, 0)
    ctx.stroke()
  }
  drawRope() {
    const ctx = <CanvasRenderingContext2D>this.context
    const hook = this
    // hook line
    ctx.beginPath()
    ctx.save()
    ctx.translate(35 * this.ratio, 15 * this.ratio)

    ctx.drawImage(this.img, hook.x - 45 * this.ratio, hook.y - 15 * this.ratio, 50 * this.ratio, 50 * this.ratio)
    ctx.lineWidth = 3 * this.ratio
    ctx.moveTo(hook.x - 30 * this.ratio, 0)
    ctx.lineTo(hook.x - 30 * this.ratio, hook.y)
    ctx.stroke()
    ctx.restore()
  }
}