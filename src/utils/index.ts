class Util {
  async loadImage(images: Array<any>) {
    let promises = images.map(item => {
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
    let resources: any = {}
    await Promise.all(promises).then(result => {
      result.forEach((r: any) => {
        resources[r.name] = r.img
      })
    })
    return resources
  }
}

export const utils = new Util()

