import images from './resource'

class Util {
  promises: any
  constructor(images: Array<any>) {
    this.setResource(images)
  }
  setResource(images: Array<any>) {
    this.promises = images.map(item => {
      return new Promise((resolve: any, reject: any) => {
        const img = new Image()
        img.src = item.path
        img.onload = () => {
          resolve({ img, ...item })
        }
        img.onerror = function (e) {
          reject(e)
        }
      })
    })
  }
  async loadImage() {
    let resources: any = {}
    await Promise.all(this.promises).then(result => {
      result.forEach((r: any) => {
        resources[r.name] = r.img
      })
    })
    return resources
  }
}

export const utils = new Util(images)

