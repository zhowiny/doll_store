import './css/style.css'
import images from './utils/resource'
import { utils } from './utils'
import Base from './components/base'
import Bg from './components/bg'
import Hook from './components/hook'
import Background from './components/bg'
import Control from './components/control'
import Gift from './components/gift'


export default class Game extends Base {
  resource: any = {}
  bg: Background = this.bg
  hook: Hook = this.hook
  gifts: Gift[] = this.gifts
  control: Control = this.control
  canvas: HTMLCanvasElement = this.canvas

  constructor(id: string) {
    super()
    this.createCanvas(id)
  }

  async init(): Promise<any> {

    // 加载所有图片资源
    this.resource = await utils.loadImage(images)

    this.bg = new Bg(this.resource.bg)

    this.hook = new Hook(this.resource.people)

    this.gifts = this.generateGift(this.hook)

    this.control = new Control(this.hook, this.gifts)

    this.render()
  }


  render(t?: number): void {
    // this.gifts = this.gifts.filter(g => !g.isDead)
    this.clear()
    // this.bg.draw()
    this.gifts.forEach(item => item.draw())
    this.hook.draw()


    this.control.update(t)
    this.control.aniId = window.requestAnimationFrame(t => {
      this.render(t)
    })
  }

  // todo 有待优化
  generateGift(hook: Hook): Gift[] {
    let size: number = 60 * this.ratio
    let gifts: Gift[] = []
    let history: Gift[] = []
    let temp: any[] = []

    history = this.loadStorage(hook)
    if (history.length > 0) return history

    let x: number = 10
    let y: number = this.canvas.height - size
    while (y > this.canvas.height - 210 * this.ratio) {
      let i = (Math.floor(Math.random() * 5) + 1)
      let g = {
        imgName: 'gift_' + i,
        img: this.resource['gift_' + i],
        x,
        y,
        width: size,
        height: size,
      }
      gifts.push(new Gift(g, hook))
      temp.push({
        img: 'gift_' + i,
        x,
        y,
        width: size,
        height: size,
      })

      x += size - 40
      if (x > this.canvas.width - size) {
        x = 10
        y -= size - 40
      }
    }

    this.saveStorage(temp)
    return gifts
  }

  loadStorage(hook: Hook): Gift[] {
    let gifts: any = []
    let temp = JSON.parse(localStorage.getItem('gifts') || '[]')
    temp.forEach((item: any) => {
      gifts.push(new Gift({
        img: this.resource[item.img],
        x: item.x,
        y: item.y,
        width: item.width,
        height: item.height,
      }, hook))
    })
    return gifts
  }
  saveStorage(gifts: any[]): void {
    localStorage.setItem('gifts', JSON.stringify(gifts))
  }

  clear(): void {
    const ctx = <CanvasRenderingContext2D>this.context
    const canvas = <HTMLCanvasElement>this.canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    window.cancelAnimationFrame(this.control.aniId)
  }
}

const game = new Game('#canvas')
game.init()