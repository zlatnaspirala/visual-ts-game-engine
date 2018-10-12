import { Counter } from "./math";

interface ImageRes { [key: string]: HTMLImageElement; }

class Resources {

  public getImg: () => HTMLImageElement;

  private images: ImageRes = {};
  private totalImages: number = 0;
  private activeSlotIndex: string = "";
  private SeqFrame: Counter;

  constructor() {
    // empty
  }

  public insertImg(name: string, path: string) {

    const img = new Image();
    img.src = path;
    img.onload = () => {
      this.totalImages++;
    };
    this.activeSlotIndex = name;
    this.images[name] = img;
    this.getImg = this.getImgSingle;
  }

  public insertImgs(name: string, imgRes: string[]) {
    this.activeSlotIndex = name;
    for (let x = 0; x < imgRes.length; x++) {
      this.insertImgSerialHelper(name + x, imgRes[x]);
    }
    this.getImg = this.getImgSerial;
    this.SeqFrame = new Counter(0, imgRes.length - 1, 1);
  }

  public getTotalImages(): number {
    return this.totalImages;
  }

  public destroy() {
    this.images = {};
    this.totalImages = 0;
  }

  private insertImgSerialHelper(name: string, path: string) {
    const img = new Image();
    img.src = path;
    img.onload = () => {
      this.totalImages++;
    };
    this.images[name] = img;
  }

  private getImgSingle(): HTMLImageElement {
    if (this.images[this.activeSlotIndex] instanceof HTMLImageElement) {
      return this.images[this.activeSlotIndex] as HTMLImageElement;
    }
  }

  private getImgSerial(): HTMLImageElement {
    return this.images[this.activeSlotIndex + this.SeqFrame.getValue()] as HTMLImageElement;
  }
}
export default Resources;
