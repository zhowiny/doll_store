import Hook from "../components/hook";
import Gift from "../components/gift";
import Base from "../components/base";
import images from '../utils/resource'
import { utils } from ".";

export default class GiftGenerate extends Base {
  createGiftList(resource: Resource, hook: Hook) {
    let history: Gift[] = this.loadStorage(resource, hook)
    if (history.length > 0) return history

    let { canvas } = hook
    let size: number = 60 * hook.ratio
    let x: number = 10
    let y: number = canvas.height - size

    let gifts: Gift[] = []
    let temp: any[] = []

    while (y > canvas.height - 210 * hook.ratio) {
      let i = ~~(Math.random() * 5 + 1)
      let g = {
        imgName: `gift_${i}`,
        img: resource[`gift_${i}`],
        x,
        y,
        width: size,
        height: size,
      }
      gifts.push(new Gift(g, hook))
      temp.push({
        img: `gift_${i}`,
        x,
        y,
        width: size,
        height: size,
      })

      x += size - 40
      if (x > canvas.width - size) {
        x = 10
        y -= size - 40
      }
    }

    this.saveStorage(temp)
    return gifts
  }

  async loadImage(): Promise<Resource> {
    return await utils.loadImage(images)
  }

  loadStorage(resource: Resource, hook: Hook): Gift[] {
    let gifts: any = []
    let temp = JSON.parse(localStorage.getItem('gifts') || '[]')
    temp.forEach((item: any) => {
      gifts.push(new Gift({
        img: resource[item.img],
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
}