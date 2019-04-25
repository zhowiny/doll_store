
interface Rect {
  x: number
  y: number
  width: number
  height: number
  [prop: string]: any
}

class Util {
  readonly ratio: number = 4
  async loadImage(images: Array<any>) {
    let promises = images.map(item => {
      return new Promise((resolve: any, reject: any) => {
        const img = new Image()
        img.src = item.path
        img.onload = () => {
          resolve({ img, ...item })
        }
        img.onerror = function (e) {
          reject(e)
        }
      })
    })
    let resources: any = {}
    await Promise.all(promises).then(result => {
      result.forEach((r: any) => {
        resources[r.name] = r.img
      })
    })
    return resources
  }


  isContain(rect: Rect, point: { pageX: number, pageY: number }) {
    if (!rect || !point) return false
    const p = {
      x: point.pageX * this.ratio,
      y: point.pageY * this.ratio,
      width: rect.width,
      height: rect.height,
    }

    return p.x > rect.x &&
      p.x < rect.x + rect.width &&
      p.y > rect.y &&
      p.y < rect.y + rect.height
  }

  isCollide(A: Rect, B: Rect) {
    return A.x + A.width > B.x && A.x < B.x + B.width && A.y + A.height > B.y && A.y < B.y + B.height
  }
  calcArea(A: Rect, B: Rect) {
    if (!this.isCollide(A, B)) return 0
    let width = Math.min(A.x + A.width, B.x + B.width) - Math.max(A.x, B.x)
    let height = Math.min(A.y + A.height, B.y + B.height) - Math.max(A.y, B.y)
    return (width * height) / (A.width * A.height)

  }
}

export const utils = new Util()

