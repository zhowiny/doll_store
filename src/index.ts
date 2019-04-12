import './css/style.css'
import { utils } from './utils'
document.write('hello world')

class Game {
  constructor() {
    this.init()
  }
  async init() {
    // 加载所有图片资源
    let resource = await utils.loadImage()
    console.log(resource)
  }
}

const game = new Game()