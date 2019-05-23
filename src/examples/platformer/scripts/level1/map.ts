import { ICollectionItem, IStaticItem } from "../../../../libs/interface/global";
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
      { x: 200, y: 100, w: 500, h: 60, tex: imgRes, tiles: 2 },
      { x: 200, y: 400, w: 500, h: 60, tex: imgRes, tiles: 2 },
      { x: 200, y: 600, w: 1500, h: 60, tex: imgRes, tiles: 1 },
      { x: 400, y: 800, w: 500, h: 60, tex: imgRes, tiles: 2 },
      { x: 1000, y: 800, w: 500, h: 60, tex: imgRes, tiles: 2 },
      { x: 1600, y: 1500, w: 1500, h: 60, tex: imgRes, tiles: 1 },
      { x: 1700, y: 1200, w: 500, h: 60, tex: imgRes, tiles: 2 },
      { x: 1800, y: 600, w: 500, h: 60, tex: imgRes, tiles: 2 },
      { x: 1900, y: 200, w: 1500, h: 60, tex: imgRes, tiles: 1 },
    ] as IStaticItem[];
  }

  public getStaticBackgrounds(): IStaticItem[] {

    const backgroundWall = require("../../imgs/wall3.jpg");

    const shema = {
      byX: 3,
      byY: 3,
    };
    const b: IStaticItem[] = [];
    for (let x = 0; x < shema.byX; x++) {
      for (let y = 0; y < shema.byY; y++) {
        b.push(
          {
            x: x * 100,
            y: y * 100,
            w: 100,
            h: 100,
            tex: backgroundWall, tiles: 1,
            collisionFilter: { category: 1, group: 1, mask: 1 },
          });
      }
    }

    return b as IStaticItem[];
  }

  public getCollectitems(): ICollectionItem[] {
    const imgRes = [require("../../imgs/collect-items/bitcoin.png")];
    return [
      { x: 200, y: 100, w: 50, h: 60, tex: imgRes, tiles: 2, colectionLabel: "bitcoin", points: 2 },
      { x: 500, y: 160, w: 50, h: 60, tex: imgRes, tiles: 1, colectionLabel: "bitcoin", points: 1 },
      { x: 100, y: 400, w: 50, h: 50, tex: imgRes, tiles: 1, colectionLabel: "bitcoin", points: 1 },
      { x: 200, y: 400, w: 50, h: 50, tex: imgRes, tiles: 1, colectionLabel: "bitcoin", points: 1 },
      { x: 300, y: 400, w: 50, h: 50, tex: imgRes, tiles: 1, colectionLabel: "bitcoin", points: 1 },
    ] as ICollectionItem[];
  }

}
export default GameMap;
