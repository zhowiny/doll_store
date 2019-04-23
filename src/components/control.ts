import Base from './base'
import Hook from './hook';
interface Rect {
  x: number
  y: number
  width: number
  height: number
  [prop: string]: any
}



export default class Control extends Base {
  canvas = <HTMLCanvasElement>this.canvas

  leftBlock: Rect = {
    x: 0,
    y: this.hook.y + this.hook.startY,
    width: this.canvas.width / 3,
    height: this.canvas.height / 2,
  }

  rightBlock: Rect = {
    x: this.canvas.width / 3 * 2,
    y: this.hook.y + this.hook.startY,
    width: this.canvas.width / 3 * 2,
    height: this.canvas.height / 2,
  }

  startBlock: Rect = {
    x: 0,
    y: this.canvas.height / 4 * 3,
    width: this.canvas.width,
    height: this.canvas.height / 4,
  }

  aniId: number = 0
  point: any = null
  status: string = this.STATUS.READY
  touchstart: (() => void) | null = null

  constructor(public hook: Hook) {
    super()
    this.addEvent()
  }

  addEvent() {
    const operationalState = [this.STATUS.READY, this.STATUS.START]
    this.canvas.addEventListener('touchstart', e => {
      const point = e.touches[0]
      const effectivePoint = this.isContain(this.startBlock, point) || this.isContain(this.leftBlock, point) || this.isContain(this.rightBlock, point)

      if (~operationalState.indexOf(this.status) && effectivePoint) {
        this.point = point
        this.status = this.STATUS.START
        this.touchstart && this.touchstart()
        this.hook.stop = false
      }
    })

    this.canvas.addEventListener('touchend', e => {
      if (~operationalState.indexOf(this.status)) {
        this.hook.stop = true
      }
    })

  }

  update(t: number = 0) {
    // console.log(t)

    if (!this.hook.stop) {
      this.moveHook()
      switch (this.status) {
        case this.STATUS.CATCH:
          this.catch()
          break
        case this.STATUS.END:
          this.reset()
          break
        default:
          break
      }
    }
  }

  moveHook() {
    const STATUS = this.STATUS
    if (this.isContain(this.startBlock, this.point)) {
      if (~[STATUS.START, STATUS.DROP].indexOf(this.status)) {
        this.status = STATUS.DROP
        this.hook.drop(() => {
          this.stop(1500)
          this.status = STATUS.CATCH
        })
      }
    } else if (this.isContain(this.leftBlock, this.point)) {
      this.hook.moveLeft()
    } else if (this.isContain(this.rightBlock, this.point)) {
      this.hook.moveRight()
    }
  }

  catch() {
    this.hook.catch(() => {
      this.status = this.STATUS.END
      this.stop(1500)
    })
  }

  reset() {
    this.hook.reset(() => {
      this.status = this.STATUS.READY
    })
  }

  stop(times: number = 500) {
    this.hook.stop = true
    setTimeout(() => {
      this.hook.stop = false
    }, times)
  }

  handleTouchstart(fn: (...arg: []) => void) {
    this.touchstart = fn
  }

}