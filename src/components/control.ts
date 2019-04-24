import Base from './base'
import Hook from './hook';
import Gift from './gift';
interface Rect {
  x: number
  y: number
  width: number
  height: number
  [prop: string]: any
}

const STATUS = {
  READY: 'ready',
  START: 'start',
  DROP: 'drop',
  OPEN: 'open',
  CATCH: 'catch',
  DRAG: 'drag',
  END: 'end',
  PAUSE: 'pause',
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
  status: string = STATUS.READY

  constructor(public hook: Hook, public gifts: Gift[]) {
    super()
    this.addEvent()
  }

  addEvent() {
    const operationalState = [STATUS.READY, STATUS.START]
    this.canvas.addEventListener('touchstart', e => {
      const point = e.touches[0]
      const effectivePoint = this.isContain(this.startBlock, point) || this.isContain(this.leftBlock, point) || this.isContain(this.rightBlock, point)

      if (~operationalState.indexOf(this.status) && effectivePoint) {
        this.point = point
        this.status = STATUS.START
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
    let gift: Gift = this.gifts.filter(g => g.isTarget)[0]
    this.gifts = this.gifts.filter(g => !g.isDead)

    if (!this.hook.stop) {
      this.moveHook(gift)
      switch (this.status) {
        case STATUS.OPEN:
          this.open()
          break
        case STATUS.CATCH:
          this.catch(gift)
          break
        case STATUS.DRAG:
          this.drag(gift)
          break
        case STATUS.END:
          this.reset(gift)
          break
        default:
          break
      }
    }
  }

  moveHook(gift: Gift) {
    if (this.isContain(this.startBlock, this.point)) {
      if (~[STATUS.START, STATUS.DROP].indexOf(this.status)) {
        this.drop(gift)
      }
    } else if (this.isContain(this.leftBlock, this.point)) {
      this.hook.moveLeft()
    } else if (this.isContain(this.rightBlock, this.point)) {
      this.hook.moveRight()
    }
  }

  drop(gift: Gift) {
    this.status = STATUS.DROP
    this.hook.drop(() => {
      this.status = STATUS.OPEN
    }, gift)
  }

  open() {
    this.hook.open(() => {
      this.status = STATUS.CATCH
      this.stop(1000)
    })
  }

  catch(gift: Gift) {
    gift && gift.move()

    this.hook.catch(() => {
      this.status = STATUS.DRAG
      this.stop(1000)
    })
  }

  drag(gift: Gift) {
    gift && gift.move()
    if (this.hook.y < 1000) {
      this.hook.resetAngle()
    }
    this.hook.drag(() => {
      this.status = STATUS.END
      this.stop(1000)
    })
  }

  reset(gift: Gift) {
    gift && gift.destroy()
    this.hook.reset(() => {
      this.status = STATUS.READY
    })
  }

  stop(times: number = 500) {
    this.hook.stop = true
    setTimeout(() => {
      this.hook.stop = false
    }, times)
  }

}