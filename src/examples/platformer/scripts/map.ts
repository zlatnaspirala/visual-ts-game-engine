import { ICollectionEnemys, ICollectionItem, IGamePlayPlatformerMap, IStaticItem } from "../../../libs/interface/global";

/**
 * Static body elements, backgrounds, enemys returns
 * Prepared for next level, 'loading from generated content'
 */

class GameMap implements IGamePlayPlatformerMap {

  constructor() {/* Empty for now. */}

  public getStaticGrounds(): IStaticItem[] {

    const imgRes = [require("../imgs/floor2.png")];
    return [
      { x: 100, y: 0, w: 400, h: 60, tex: imgRes, tiles: { tilesX: 6, tilesY: 1 } },
      { x: 100, y: 500, w: 400, h: 60, tex: imgRes, tiles: { tilesX: 6, tilesY: 1 } },
      { x: 100, y: 1000, w: 150, h: 60, tex: imgRes, tiles: { tilesX: 2, tilesY: 1 } },
      { x: 100, y: 1500, w: 400, h: 60, tex: imgRes, tiles: { tilesX: 6, tilesY: 1 } },
      { x: 100, y: 2000, w: 400, h: 60, tex: imgRes, tiles: { tilesX: 6, tilesY: 1 } },
      { x: 100, y: 2500, w: 400, h: 60, tex: imgRes, tiles: { tilesX: 6, tilesY: 1 } },
      { x: 500, y: 0, w: 150, h: 60, tex: imgRes, tiles: { tilesX: 2, tilesY: 1 } },
      { x: 500, y: 200, w: 400, h: 60, tex: imgRes, tiles: { tilesX: 6, tilesY: 1 } },
      { x: 500, y: 400, w: 400, h: 60, tex: imgRes, tiles: { tilesX: 6, tilesY: 1 } },
      { x: 500, y: 800, w: 400, h: 60, tex: imgRes, tiles: { tilesX: 6, tilesY: 1 } },
      { x: 500, y: 1500, w: 400, h: 60, tex: imgRes, tiles: { tilesX: 6, tilesY: 1 } },
      { x: 1800, y: 0, w: 400, h: 60, tex: imgRes, tiles:  { tilesX: 6, tilesY: 1 } },
      { x: 1800, y: 300, w: 400, h: 60, tex: imgRes, tiles: { tilesX: 6, tilesY: 1} },
      { x: 1800, y: 800, w: 400, h: 60, tex: imgRes, tiles: { tilesX: 6, tilesY: 1 } },
      { x: 1800, y: 1200, w: 400, h: 60, tex: imgRes, tiles: { tilesX: 6, tilesY: 1 } },
      { x: 1800, y: 1800, w: 400, h: 60, tex: imgRes, tiles: { tilesX: 6, tilesY: 1 } },
      { x: 2800, y: 250, w: 400, h: 60, tex: imgRes, tiles: { tilesX: 6, tilesY: 1 } },
      { x: 2800, y: 3100, w: 400, h: 60, tex: imgRes, tiles: { tilesX: 6, tilesY: 1 } },
    ] as IStaticItem[];
  }

  public getStaticBackgrounds(): IStaticItem[] {

    const backgroundWall = require("../imgs/wall3.png");

    const shema = {
      byX: 3,
      byY: 3,
    };

    const b: IStaticItem[] = [];
    for (let x = 0; x < shema.byX; x++) {
      for (let y = 0; y < shema.byY; y++) {
        b.push(
          {
            x: x * 1000,
            y: y * 1000,
            w: 1000,
            h: 1000,
            tex: backgroundWall, tiles: { tilesX: 4, tilesY: 2 },
          });
      }
    }

    return b as IStaticItem[];
  }

  public getCollectItems(): ICollectionItem[] {
    const imgRes = [require("../imgs/collect-items/bitcoin.png")];
    return [
      { x: 0, y: 0, w: 50, h: 60, tex: imgRes, tiles: { tilesX: 2, tilesY: 2 }, colectionLabel: "bitcoin", points: 2 },
      { x: 0, y: 160, w: 50, h: 60, tex: imgRes, tiles: { tilesX: 1, tilesY: 1 }, colectionLabel: "bitcoin", points: 1 },
      { x: 300, y: 400, w: 50, h: 50, tex: imgRes, tiles: { tilesX: 1, tilesY: 1 }, colectionLabel: "bitcoin", points: 1 },
      { x: 300, y: 800, w: 50, h: 50, tex: imgRes, tiles: { tilesX: 1, tilesY: 1 }, colectionLabel: "bitcoin", points: 1 },
      { x: 600, y: 800, w: 50, h: 50, tex: imgRes, tiles: { tilesX: 1, tilesY: 1 }, colectionLabel: "bitcoin", points: 1 },
    ] as ICollectionItem[];
  }

  public getEnemys(): ICollectionEnemys[] {

    const imgCrap = [require("../imgs/crapmunch/crapmunch.png")];
    const imgCooper = [require("../imgs/chopper/chopper.png")];
    return [
      { x: 0, y: -200, w: 120, h: 120, tex: imgCrap, tiles: { tilesX: 1, tilesY: 1 }, colectionLabel: "enemy_crapmunch"},
      { x: 0, y: 0, w: 120, h: 120, tex: imgCrap, tiles: { tilesX: 1, tilesY: 1 }, colectionLabel: "enemy_crapmunch" },
      { x: 200, y: 0, w: 60, h: 60, tex: imgCooper, tiles: { tilesX: 1, tilesY: 1 }, colectionLabel: "enemy_chopper" },
      { x: 200, y: 0, w: 60, h: 60, tex: imgCooper, tiles: { tilesX: 1, tilesY: 1 }, colectionLabel: "enemy_chopper" },
    ] as ICollectionItem[];
  }

  public getDeadLines(): ICollectionEnemys[] {

    const img = [require("../imgs/flame.png")];

    return [
      { x: 100, y: 2500, w: 555, h: 50, tex: img, tiles:   { tilesX: 3, tilesY: 6 }, colectionLabel: "deadline" },
    ] as ICollectionEnemys[];
  }

}
export default GameMap;
