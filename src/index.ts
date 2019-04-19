import './css/style.css'
import images from './utils/resource'
import { utils } from './utils'
import Base from './components/base'
import Bg from './components/bg'
import Hook from './components/hook'
import Background from './components/bg'

const STATUS = {
  READY: 'ready',
  START: 'start',
  DROP: 'drop',
  CATCH: 'catch',
  END: 'end',
}

export default class Game extends Base {
  resource: any = {}
  bg: Background | null = null
  hook: Hook | null = null
  startTime: number = 0
  aniId: number = 0
  point: any = null
  status: string = STATUS.READY

  constructor(id: string) {
    super()
    const canvas = <HTMLCanvasElement>this.canvas
    this.createCanvas(id)
    canvas.addEventListener('touchstart', e => {
      if (this.status === STATUS.READY || this.status === STATUS.START) {
        this.point = e.touches[0]
        window.cancelAnimationFrame(this.aniId)
        this.status = STATUS.START
        this.render()
      }
    })
    canvas.addEventListener('touchend', e => {
      if (this.status === STATUS.READY || this.status === STATUS.START) {
        this.stop()
      }
    })
  }

  async init() {

    window.cancelAnimationFrame(this.aniId)

    // 加载所有图片资源
    this.resource = await utils.loadImage(images)

    this.bg = new Bg(this.resource.bg)

    this.hook = new Hook(this.resource.people)

    this.render()
  }

  async update() {
    console.log(this.status)
    const hook = <Hook>this.hook
    const canvas = <HTMLCanvasElement>this.canvas
    const left = {
      x: 0,
      y: hook.y + hook.startY,
      width: canvas.width / 3,
      height: canvas.height / 2,
    }
    const right = {
      x: canvas.width / 3 * 2,
      y: hook.y + hook.startY,
      width: canvas.width / 3 * 2,
      height: canvas.height / 2,
    }
    const start = {
      x: 0,
      y: canvas.height / 4 * 3,
      width: canvas.width,
      height: canvas.height / 4,
    }
    if (this.isContain(start, this.point)) {
      if (this.status !== STATUS.CATCH) {
        this.status = STATUS.DROP
        await hook.drop()
        setTimeout(() => {
          this.status = STATUS.CATCH
        }, 500)
      }
    } else if (this.isContain(left, this.point)) {
      hook.moveLeft()
    } else if (this.isContain(right, this.point)) {
      hook.moveRight()
    }

    if (this.status === STATUS.CATCH) {
      await hook.catch()
      this.status = STATUS.END
    }
    if (this.status === STATUS.END) {
      console.log(123)
      await hook.reset()
      this.status = STATUS.READY
      this.stop()
    }
  }

  render() {
    const hook = <Hook>this.hook
    this.bg && this.bg.draw()
    hook.draw()

    if (this.status === STATUS.READY) return
    this.update()

    this.aniId = window.requestAnimationFrame(t => {
      // if (!this.startTime) this.startTime = t
      this.render()
    })
  }

  stop() {
    window.cancelAnimationFrame(this.aniId)
  }
}

const game = new Game('#canvas')
game.init()