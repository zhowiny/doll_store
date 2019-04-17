import './css/style.css'
import images from './utils/resource'
import { utils } from './utils'
import Base from './components/base'
import Bg from './components/bg'
import Hook from './components/hook'
import Background from './components/bg';

export default class Game extends Base {
  resource: any = {}
  bg: Background | null = null
  hook: Hook | null = null

  async init(id: string) {

    this.createCanvas(id)

    // 加载所有图片资源
    this.resource = await utils.loadImage(images)

    this.bg = new Bg(this.resource.bg)

    this.hook = new Hook(this.resource.people)
  }

}

const game = new Game()
game.init('#canvas')