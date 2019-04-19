declare global {
  interface Window {
    canvas: HTMLCanvasElement
  }
}
interface Rect {
  x: number
  y: number
  width: number
  height: number
  [prop: string]: any
}

export default class Base {
  canvas: HTMLCanvasElement | null = null
  context: CanvasRenderingContext2D | null = null
  readonly ratio: number = 4

  constructor() {
    if (window.canvas) {
      this.canvas = window.canvas
      this.context = this.canvas.getContext('2d')
    }
  }

  createCanvas(id: string) {
    let canvas: HTMLCanvasElement | null = document.querySelector(id)
    if (!canvas) {
      canvas = document.createElement('canvas')
      canvas.id = id
      document.body.appendChild(canvas)
    }

    const w = document.body.clientWidth
    const h = document.body.clientHeight
    canvas.width = w * this.ratio
    canvas.height = h * this.ratio
    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`
    this.canvas = canvas
    this.context = canvas.getContext('2d')
    window.canvas = canvas
  }

  roundedRect(x: number = 0, y: number = 0, width: number, height: number, radius: number) {
    let ctx = <CanvasRenderingContext2D>this.context
    ctx.save()
    ctx.beginPath()
    ctx.strokeStyle = '#666'
    ctx.lineWidth = 2 * this.ratio
    ctx.moveTo(x, y + radius)
    ctx.lineTo(x, y + height - radius)
    ctx.quadraticCurveTo(x, y + height, x + radius, y + height)
    ctx.lineTo(x + width - radius, y + height)
    ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius)
    ctx.lineTo(x + width, y + radius)
    ctx.quadraticCurveTo(x + width, y, x + width - radius, y)
    ctx.lineTo(x + radius, y)
    ctx.quadraticCurveTo(x, y, x, y + radius)

    for (var i = 1; i < Math.floor(height / 20); i++) {
      ctx.moveTo(x, y + (i * 20))
      ctx.lineTo(x + width, y + (i * 20))
    }
    ctx.stroke()
  }

  isContain(rect: Rect, point: { pageX: number, pageY: number }) {
    if (!rect || !point) return false
    const ctx = <CanvasRenderingContext2D>this.context
    const p = {
      x: point.pageX * this.ratio,
      y: point.pageY * this.ratio,
      width: rect.width,
      height: rect.height,
    }
    ctx.beginPath()
    ctx.strokeStyle = '#666'
    ctx.lineWidth = 2 * this.ratio
    ctx.strokeRect(rect.x, rect.y, rect.width, rect.height)
    ctx.strokeStyle = '#aaf'
    ctx.arc(p.x, p.y, 50, 0, Math.PI * 2)
    ctx.stroke()

    return p.x > rect.x &&
      p.x < rect.x + rect.width &&
      p.y > rect.y &&
      p.y < rect.y + rect.height
  }

}