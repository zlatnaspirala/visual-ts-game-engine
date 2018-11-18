import { IStaticItem } from "../../../../libs/interface/global";
import Starter from "../../../../libs/starter";

/**
 * Static body elements, backgrounds etc.
 */

class GameMap {

  private starter: Starter;

  constructor(r: Starter) {
    this.starter = r;
  }

  public getStaticGrounds(): IStaticItem[] {

    const imgRes = [require("../../imgs/floor.png")];
    return [
      { x: 0, y: 0, w: 100, h: 6, tex: imgRes, tiles: 2 },
      { x: 50, y: -20, w: 20, h: 6, tex: imgRes, tiles: 2 },
      { x: 10, y: 90, w: 90, h: 3, tex: imgRes, tiles: 1 },
      /*
      { x: 10, y: 10, w: 30, h: 6, tex: imgRes, tiles: 5 },
      { x: 110, y: 30, w: 30, h: 6, tex: imgRes, tiles: 5 },
      { x: 70, y: 60, w: 30, h: 6, tex: imgRes, tiles: 5 },
      */
    ] as IStaticItem[];
  }

  public getStaticBackgrounds(): IStaticItem[] {

    const backgroundWall = require("../../imgs/wallStock.jpg");

    const shema = {
      byX: 3,
      byY: 3,
    };
    const b: IStaticItem[] = [];
    for (let x = 0; x < shema.byX; x++) {
      for (let y = 0; y < shema.byY; y++) {

        b.push(
          {
            x: this.starter.getView().getWidth(x * 10),
            y: this.starter.getView().getWidth(y * 10),
            w: this.starter.getView().getWidth(10),
            h: this.starter.getView().getWidth(10),
            tex: backgroundWall, tiles: 2,
            collisionFilter: { category: 1, group: 1, mask: 1 },
          });
      }
    }

    return b as IStaticItem[];
  }

  public getCollectitems(): IStaticItem[] {
    const imgRes = [require("../../imgs/collect-items/bitcoin.png")];
    return [
      { x: 0, y: -10, w: 5, h: 6, tex: imgRes, tiles: 2 },
      { x: 50, y: -46, w: 5, h: 6, tex: imgRes, tiles: 1 },
      { x: 10, y: 80, w: 5, h: 5, tex: imgRes, tiles: 1 },
    ] as IStaticItem[];
  }

}
export default GameMap;
