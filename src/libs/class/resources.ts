import { Counter } from "./math";

interface ImageRes { [key: string]: HTMLImageElement; }

class Resources {

  private images: ImageRes = {};
  private totalImages: number = 0;
  private counter?: Counter;

  constructor() {
    // empty
  }

  public getImg(name?: string, id?: number): HTMLImageElement {

    if (name) { if (this.images[name] instanceof HTMLImageElement) { return this.images[name]; } }
    if (id) { return this.images["tex" + id] as HTMLImageElement; }
    if (this.images.tex0) { return this.images.tex0 as HTMLImageElement; }

  }

  public insertImg(name: string, path: string) {

    const img = new Image();
    img.src = path;
    img.onload = () => {
      this.totalImages++;
    };
    this.images[name] = img;

  }

  public insertSerial(imgRes: string[]) {

    for (let x = 0; x < imgRes.length; x++) {
      this.insertImg("tex" + x, imgRes[x]);
    }

  }

  public getTotalImages(): number {
    return this.totalImages;
  }

}
export default Resources;
