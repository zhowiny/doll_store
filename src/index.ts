import './css/style.css'
import Base from './components/base'
import Bg from './components/bg'
import Hook from './components/hook'
import Background from './components/bg'
import Control from './components/control'
import Gift from './components/gift'
import GiftGenerate from './utils/generate'


export default class Game extends Base {
  resource!: Resource
  bg!: Background
  hook!: Hook
  gifts!: Gift[]
  control!: Control
  canvas!: HTMLCanvasElement

  constructor(id: string) {
    super()
    this.createCanvas(id)
  }

  async init(): Promise<any> {

    console.log(process.env)
    const generate = new GiftGenerate()
    // 加载所有图片资源
    this.resource = await generate.loadImage()

    this.bg = new Bg(this.resource.bg)

    this.hook = new Hook(this.resource.people)

    this.gifts = generate.createGiftList(this.resource, this.hook)

    this.control = new Control(this.hook, this.gifts)

    this.render()
  }


  render(t?: number): void {
    // this.gifts = this.gifts.filter(g => !g.isDead)
    this.clear()
    this.bg.draw()
    this.gifts.forEach(item => item.draw())
    this.hook.draw()


    this.control.update(t)
    this.control.aniId = window.requestAnimationFrame(t => {
      this.render(t)
    })
  }


  clear(): void {
    const ctx = this.context
    const canvas = this.canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    window.cancelAnimationFrame(this.control.aniId)
  }
}

const game = new Game('#canvas')
game.init()
