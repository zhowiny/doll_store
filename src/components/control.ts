import Base from './base'
import Hook from './hook';
import Gift from './gift';
import { utils } from '../utils';
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
      const effectivePoint = utils.isContain(this.startBlock, point) || utils.isContain(this.leftBlock, point) || utils.isContain(this.rightBlock, point)

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

    // todo 某些情况gift取值错误
    const temp = this.gifts.filter(g => g.isTarget)
    const gift: Gift = temp[temp.length - 1]
    const collideGift = this.gifts.filter(g => g.collide).reverse()[0]
    this.gifts = this.gifts.filter(g => !g.isDead)


    const ignoreStatus = [STATUS.DRAG, STATUS.END]
    // console.log(gift)
    if (~ignoreStatus.indexOf(this.status)) this.giftMove(gift)
    if (!this.hook.stop) {
      this.moveHook(gift || collideGift)
      switch (this.status) {
        // case STATUS.OPEN:
        //   this.open()
        //   break
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
    if (utils.isContain(this.startBlock, this.point)) {
      if (~[STATUS.START, STATUS.DROP].indexOf(this.status)) {
        this.drop(gift)
      }
    } else if (utils.isContain(this.leftBlock, this.point)) {
      this.hook.moveLeft()
    } else if (utils.isContain(this.rightBlock, this.point)) {
      this.hook.moveRight()
    }
  }

  drop(gift: Gift) {
    this.status = STATUS.DROP
    if (this.hook.y > 800) {
      this.open()
    }
    this.hook.drop(gift, () => {
      this.status = STATUS.CATCH
      this.stop(1000)
    })
  }

  open() {
    this.hook.open(() => {

    })
  }

  canCatch: boolean = false
  catch(gift: Gift) {
    this.giftMove(gift)
    this.hook.catch(() => {
      this.status = STATUS.DRAG
      this.canCatch = gift && Math.random() > gift.rate
      this.stop(1000)
    })
  }

  cantCatch: boolean = false
  drag(gift: Gift) {
    if (gift) {
      if (this.hook.y > 500 && Math.random() * Math.random() > 0.75) this.cantCatch = true
      if (!this.canCatch && this.cantCatch && this.hook.y < 1200) {
        this.hook.resetAngle() && gift.reset()
      }
    }
    this.hook.drag(() => {
      this.status = STATUS.END
      this.stop(1000)
    })
  }

  reset(gift: Gift) {
    this.hook.reset(() => {
      gift ? this.success(gift) : this.fail()
      this.status = STATUS.READY
    })
  }

  giftMove(gift: Gift) {
    if (!gift) return
    if (gift.resetting) {
      gift.reset()
    } else {
      gift.move()
    }
  }

  stop(times: number = 500) {
    this.hook.stop = true
    setTimeout(() => {
      this.hook.stop = false
    }, times)
  }

  fail() {

  }

  success(gift: Gift) {
    gift && gift.destroy()
    console.log('success', gift)
  }

}