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

    const imgRes = ["https://maximumroulette.com/visual-ts/beta/imgs/floor.png"];
    return [
      { x: 20, y: 10, w: 50, h: 6, tex: imgRes, tiles: 2 },
      { x: 20, y: 40, w: 50, h: 6, tex: imgRes, tiles: 2 },
      { x: 20, y: 60, w: 150, h: 6, tex: imgRes, tiles: 1 },
      { x: 40, y: 80, w: 50, h: 6, tex: imgRes, tiles: 2 },
      { x: 100, y: 80, w: 50, h: 6, tex: imgRes, tiles: 2 },
      { x: 160, y: 150, w: 150, h: 6, tex: imgRes, tiles: 1 },
      { x: 170, y: 120, w: 50, h: 6, tex: imgRes, tiles: 2 },
      { x: 180, y: 60, w: 50, h: 6, tex: imgRes, tiles: 2 },
      { x: 190, y: 20, w: 150, h: 6, tex: imgRes, tiles: 1 },
      /*
      { x: 10, y: 10, w: 30, h: 6, tex: imgRes, tiles: 5 },
      { x: 110, y: 30, w: 30, h: 6, tex: imgRes, tiles: 5 },
      { x: 70, y: 60, w: 30, h: 6, tex: imgRes, tiles: 5 },
      */
    ] as IStaticItem[];
  }

  public getStaticBackgrounds(): IStaticItem[] {

    const backgroundWall = "https://maximumroulette.com/visual-ts/beta/imgs/wall3.jpg";

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
            tex: backgroundWall, tiles: 1,
            collisionFilter: { category: 1, group: 1, mask: 1 },
          });
      }
    }

    return b as IStaticItem[];
  }

  public getCollectitems(): ICollectionItem[] {
    const imgRes = ["https://maximumroulette.com/visual-ts/beta/imgs/bitcoin.png"];
    return [
      { x: 20, y: 10, w: 5, h: 6, tex: imgRes, tiles: 2, colectionLabel: "bitcoin", points: 2 },
      { x: 50, y: 16, w: 5, h: 6, tex: imgRes, tiles: 1, colectionLabel: "bitcoin", points: 1 },
      { x: 10, y: 40, w: 5, h: 5, tex: imgRes, tiles: 1, colectionLabel: "bitcoin", points: 1 },
      { x: 20, y: 40, w: 5, h: 5, tex: imgRes, tiles: 1, colectionLabel: "bitcoin", points: 1 },
      { x: 30, y: 40, w: 5, h: 5, tex: imgRes, tiles: 1, colectionLabel: "bitcoin", points: 1 },
    ] as ICollectionItem[];
  }

}
export default GameMap;
