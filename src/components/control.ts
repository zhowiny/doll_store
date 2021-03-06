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
  gift: Gift | undefined = undefined
  count: number = 0
  maxCount: number = 20 // 每n次必中一次

  constructor(public hook: Hook, public gifts: Gift[]) {
    super()
    this.addEvent()
  }

  addEvent(): void {
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

  update(t: number = 0): void {
    // console.log(t)

    const temp = this.gifts.filter(g => g.isTarget)
    this.gift = temp.reduce((pre, next) => pre.collideArea > next.collideArea ? pre : next, temp[0])
    const collideGift: Gift = this.gifts.filter(g => g.collide).reverse()[0]
    this.gifts = this.gifts.filter(g => !g.isDead)


    const ignoreStatus = [STATUS.DRAG, STATUS.END, STATUS.READY]
    // console.log(gift)
    if (~ignoreStatus.indexOf(this.status)) this.giftMove()
    if (!this.hook.stop) {
      this.moveHook(this.gift || collideGift)
      switch (this.status) {
        case STATUS.CATCH:
          this.catch()
          break
        case STATUS.DRAG:
          this.drag()
          break
        case STATUS.END:
          this.reset()
          break
        default:
          break
      }
    }
  }

  moveHook(gift: Gift): void {
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

  drop(gift: Gift): void {
    this.status = STATUS.DROP
    if (this.hook.y > 800) {
      this.open()
    }
    this.hook.drop(gift, () => {
      this.status = STATUS.CATCH
      this.stop(1000)
    })
  }

  open(): void {
    this.hook.open()
  }

  canCatch: boolean = false
  catch(): void {
    this.hook.catch(() => {
      this.status = STATUS.DRAG
      this.count++
      if (this.count === this.maxCount) {
        this.canCatch = true
      } else {
        this.canCatch = !!this.gift && Math.random() > 1 - this.gift.rate
      }
      this.canCatch && (this.count = 0)
      console.log(this.canCatch)
      this.stop(1000)
    })
    this.giftMove()
  }

  drag(): void {
    this.hook.drag(() => {
      this.status = STATUS.END
      !this.canCatch && this.gift && this.gift.reset()
      this.stop(1000)
    })
  }

  reset(): void {
    this.hook.reset(() => {
      if (this.gift) {
        this.success()
      } else {
        this.fail()
      }
      this.status = STATUS.READY
    })
  }

  giftMove(): void {
    if (!this.gift) return
    this.gift.move(() => {
    })
  }

  // cantCatch: boolean = false
  // randomDrop(status: string) {
  //   if (this.gift && !this.gift.resetting) {
  //     // if (status === 'drag' && this.hook.y > 800 && Math.random() > 0.995) {
  //     //   this.cantCatch = true
  //     // }
  //     // if (status === 'reset' && this.hook.x > 400 && Math.random() > 0.95) {
  //     //   this.cantCatch = true
  //     // }
  //     if (this.hook.x < 400 && this.hook.y < 800) {
  //       console.log(this.hook)
  //       this.cantCatch = true
  //     }
  //     if (!this.canCatch && this.cantCatch) {
  //       this.hook.resetAngle() && this.gift.reset()
  //     }
  //   }
  // }

  stop(times: number = 500): void {
    this.hook.stop = true
    setTimeout(() => {
      this.hook.stop = false
    }, times)
  }

  fail(): void {

  }

  success(): void {
    this.gift && this.gift.destroy()
    console.log('success', this.gift)
  }

}