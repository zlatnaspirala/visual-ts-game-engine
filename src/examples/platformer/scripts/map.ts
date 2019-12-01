import { ICollectionEnemys, ICollectionItem, IGamePlayPlatformerMap, IStaticItem, IStaticLabel } from "../../../libs/interface/global";

/**
 * Static body elements, backgrounds, enemys returns
 * Prepared for next level, 'loading from generated content'
 * Path for images `../imgs/`
 * Inject or predefine here
 */

class GameMap implements IGamePlayPlatformerMap {

  private options: any = null;

  constructor(options?: any) {
    // Options
    if (typeof options !== 'undefined') {
      this.options = options;
    }
  }

  public getStaticGrounds(): IStaticItem[] {

    const LocalWidth = 650;
    const imgRes = [require("../imgs/floor2.png")];
    const imgResTest = [require("../imgs/grounds/texx.png")];
    // const imgRes = [require("../imgs/backgrounds/forest.png")];

    const tileXLocal = 10;
    return [
      { x: 100, y: 0, w: LocalWidth, h: 60, tex: imgRes, tiles: { tilesX: tileXLocal, tilesY: 1 } },
      { x: 100, y: 500, w: LocalWidth, h: 60, tex: imgRes, tiles: { tilesX: tileXLocal, tilesY: 1 } },
 {
    "x": 134,
    "y": 129,
    "w": 100,
    "h": 20,
    "tex": "./imgs/texx.png",
    "tiles": {
      "tilesX": 5,
      "tilesY": 1
    }
  },
  {
    "x": 325,
    "y": 133,
    "w": 100,
    "h": 20,
    "tex": "./imgs/texx.png",
    "tiles": {
      "tilesX": 5,
      "tilesY": 1
    }
  },
  {
    "x": 539,
    "y": 139,
    "w": 100,
    "h": 20,
    "tex": "./imgs/texx.png",
    "tiles": {
      "tilesX": 5,
      "tilesY": 1
    }
  },
  {
    "x": 741,
    "y": 143,
    "w": 100,
    "h": 20,
    "tex": "./imgs/texx.png",
    "tiles": {
      "tilesX": 5,
      "tilesY": 1
    }
  },
  {
    "x": 944,
    "y": 145,
    "w": 100,
    "h": 20,
    "tex": "./imgs/texx.png",
    "tiles": {
      "tilesX": 5,
      "tilesY": 1
    }
  },
  {
    "x": 1135,
    "y": 142,
    "w": 100,
    "h": 20,
    "tex": "./imgs/texx.png",
    "tiles": {
      "tilesX": 5,
      "tilesY": 1
    }
  },
  {
    "x": 1350,
    "y": 144,
    "w": 100,
    "h": 20,
    "tex": "./imgs/texx.png",
    "tiles": {
      "tilesX": 5,
      "tilesY": 1
    }
  },
  {
    "x": 1567,
    "y": 148,
    "w": 100,
    "h": 20,
    "tex": "./imgs/texx.png",
    "tiles": {
      "tilesX": 5,
      "tilesY": 1
    }
  },
  {
    "x": 163,
    "y": 257,
    "w": 100,
    "h": 20,
    "tex": "./imgs/texx.png",
    "tiles": {
      "tilesX": 5,
      "tilesY": 1
    }
  },
  {
    "x": 153,
    "y": 350,
    "w": 100,
    "h": 20,
    "tex": "./imgs/texx.png",
    "tiles": {
      "tilesX": 5,
      "tilesY": 1
    }
  },
  {
    "x": 169,
    "y": 458,
    "w": 100,
    "h": 20,
    "tex": "./imgs/texx.png",
    "tiles": {
      "tilesX": 5,
      "tilesY": 1
    }
  },
  {
    "x": 172,
    "y": 555,
    "w": 100,
    "h": 20,
    "tex": "./imgs/texx.png",
    "tiles": {
      "tilesX": 5,
      "tilesY": 1
    }
  },
  {
    "x": 164,
    "y": 648,
    "w": 100,
    "h": 20,
    "tex": "./imgs/texx.png",
    "tiles": {
      "tilesX": 5,
      "tilesY": 1
    }
  },
  {
    "x": 168,
    "y": 750,
    "w": 100,
    "h": 20,
    "tex": "./imgs/texx.png",
    "tiles": {
      "tilesX": 5,
      "tilesY": 1
    }
  },
  {
    "x": 170,
    "y": 839,
    "w": 100,
    "h": 20,
    "tex": "./imgs/texx.png",
    "tiles": {
      "tilesX": 5,
      "tilesY": 1
    }
  }

    ] as IStaticItem[];
  }

  public getStaticBackgrounds(): IStaticItem[] {

    // const backgroundWall = require("../imgs/wall3.png");
    const backgroundWall = [require("../imgs/backgrounds/forest.png")];

    const shema = {
      byX: 3,
      byY: 1,
    };

    const subShema = {
      byX: 1,
      byY: 1,
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
            tex: backgroundWall, tiles: { tilesX: subShema.byX, tilesY: subShema.byY },
          });
      }
    }

    return b as IStaticItem[];
  }

  public getCollectItems(): ICollectionItem[] {
    const LocalWidth = 60;
    const tileXLocal = 1;
    const deltaYLocal = -200;
    const imgRes = [require("../imgs/collect-items/bitcoin.png")];
    return [
      { x: 0, y: 0, w: 50, h: 60, tex: imgRes, tiles: { tilesX: 2, tilesY: 2 }, colectionLabel: "bitcoin", points: 2 },

      { x: 100, y: 0 + deltaYLocal, w: LocalWidth, h: 60, tex: imgRes, tiles: { tilesX: tileXLocal, tilesY: 1 }, colectionLabel: "bitcoin", points: 2 },
      { x: 100, y: 500 + deltaYLocal, w: LocalWidth, h: 60, tex: imgRes, tiles: { tilesX: tileXLocal, tilesY: 1 }, colectionLabel: "bitcoin", points: 2 },
      { x: 100, y: 1000 + deltaYLocal, w: LocalWidth, h: 60, tex: imgRes, tiles: { tilesX: tileXLocal, tilesY: 1 }, colectionLabel: "bitcoin", points: 2 },
      { x: 100, y: 1500 + deltaYLocal, w: LocalWidth, h: 60, tex: imgRes, tiles: { tilesX: tileXLocal, tilesY: 1 }, colectionLabel: "bitcoin", points: 2 },
      { x: 100, y: 2000 + deltaYLocal, w: LocalWidth, h: 60, tex: imgRes, tiles: { tilesX: tileXLocal, tilesY: 1 }, colectionLabel: "bitcoin", points: 2  },
      { x: 100, y: 2500 + deltaYLocal, w: LocalWidth, h: 60, tex: imgRes, tiles: { tilesX: tileXLocal, tilesY: 1 }, colectionLabel: "bitcoin", points: 2  },
      { x: 500, y: 0 + deltaYLocal, w: LocalWidth, h: 60, tex: imgRes, tiles: { tilesX: tileXLocal, tilesY: 1 }, colectionLabel: "bitcoin", points: 2  },
      { x: 500, y: 200 + deltaYLocal, w: LocalWidth, h: 60, tex: imgRes, tiles: { tilesX: tileXLocal, tilesY: 1 }, colectionLabel: "bitcoin", points: 2  },
      { x: 500, y: 400 + deltaYLocal, w: LocalWidth, h: 60, tex: imgRes, tiles: { tilesX: tileXLocal, tilesY: 1 }, colectionLabel: "bitcoin", points: 2  },
      { x: 500, y: 800 + deltaYLocal, w: LocalWidth, h: 60, tex: imgRes, tiles: { tilesX: tileXLocal, tilesY: 1 }, colectionLabel: "bitcoin", points: 2  },
      { x: 500, y: 1500 + deltaYLocal, w: LocalWidth, h: 60, tex: imgRes, tiles: { tilesX: tileXLocal, tilesY: 1 }, colectionLabel: "bitcoin", points: 2  },
      { x: 1800, y: 0 + deltaYLocal, w: LocalWidth, h: 60, tex: imgRes, tiles: { tilesX: tileXLocal, tilesY: 1 }, colectionLabel: "bitcoin", points: 2  },
      { x: 1800, y: 300 + deltaYLocal, w: LocalWidth, h: 60, tex: imgRes, tiles: { tilesX: tileXLocal, tilesY: 1 }, colectionLabel: "bitcoin", points: 2  },
      { x: 1800, y: 800 + deltaYLocal, w: LocalWidth, h: 60, tex: imgRes, tiles: { tilesX: tileXLocal, tilesY: 1 }, colectionLabel: "bitcoin", points: 2  },
      { x: 1800, y: 1200 + deltaYLocal, w: LocalWidth, h: 60, tex: imgRes, tiles: { tilesX: tileXLocal, tilesY: 1 }, colectionLabel: "bitcoin", points: 2  },
      { x: 1800, y: 1800 + deltaYLocal, w: LocalWidth, h: 60, tex: imgRes, tiles: { tilesX: tileXLocal, tilesY: 1 }, colectionLabel: "bitcoin", points: 2  },
      { x: 2800, y: 250 + deltaYLocal, w: LocalWidth, h: 60, tex: imgRes, tiles: { tilesX: tileXLocal, tilesY: 1 }, colectionLabel: "bitcoin", points: 2  },
      { x: 2800, y: 3100 + deltaYLocal, w: LocalWidth, h: 60, tex: imgRes, tiles: { tilesX: tileXLocal, tilesY: 1 }, colectionLabel: "bitcoin", points: 2  },

    ] as ICollectionItem[];
  }

  public getEnemys(): ICollectionEnemys[] {

    const imgCrap = [require("../imgs/crapmunch/crapmunch.png")];
    const imgCooper = [require("../imgs/chopper/chopper.png")];

    const deltaYLocal = 100;
    const enemyWidth = 100;
    const enemyHeight = 100;

    return [
      {
        x: 0, y: -300 + deltaYLocal, w: enemyWidth, h: enemyHeight,
         tex: imgCrap, tiles: { tilesX: 1, tilesY: 1 }, colectionLabel: "enemy_crapmunch"},
      {
        x: 0, y: 500 + deltaYLocal, w: enemyWidth, h: enemyHeight,
         tex: imgCrap, tiles: { tilesX: 1, tilesY: 1 }, colectionLabel: "enemy_crapmunch"},
      {
        x: 0, y: 1000 + deltaYLocal, w: enemyWidth, h: enemyHeight,
         tex: imgCrap, tiles: { tilesX: 1, tilesY: 1 }, colectionLabel: "enemy_crapmunch"},
      {
        x: 0, y: 1500 + deltaYLocal, w: enemyWidth, h: enemyHeight,
         tex: imgCrap, tiles: { tilesX: 1, tilesY: 1 }, colectionLabel: "enemy_crapmunch" },
      {
        x: 0, y: 2000 + deltaYLocal, w: enemyWidth, h: enemyHeight,
         tex: imgCrap, tiles: { tilesX: 1, tilesY: 1 }, colectionLabel: "enemy_crapmunch" },
      {
        x: 100, y: 2500 + deltaYLocal, w: enemyWidth, h: enemyHeight,
         tex: imgCrap, tiles: { tilesX: 1, tilesY: 1 }, colectionLabel: "enemy_crapmunch" },
      {
        x: 500, y: 0 + deltaYLocal, w: enemyWidth, h: enemyHeight,
         tex: imgCrap, tiles: { tilesX: 1, tilesY: 1 }, colectionLabel: "enemy_crapmunch" },
      {
        x: 500, y: 200 + deltaYLocal, w: enemyWidth, h: enemyHeight,
         tex: imgCrap, tiles: { tilesX: 1, tilesY: 1 }, colectionLabel: "enemy_crapmunch"},
      {
        x: 500, y: 400 + deltaYLocal, w: enemyWidth, h: enemyHeight,
         tex: imgCrap, tiles: { tilesX: 1, tilesY: 1 }, colectionLabel: "enemy_crapmunch" },
      {
        x: 500, y: 800 + deltaYLocal, w: enemyWidth, h: enemyHeight,
         tex: imgCrap, tiles: { tilesX: 1, tilesY: 1 }, colectionLabel: "enemy_crapmunch" },
      {
        x: 500, y: 1500 + deltaYLocal, w: enemyWidth, h: enemyHeight,
         tex: imgCrap, tiles: { tilesX: 1, tilesY: 1 }, colectionLabel: "enemy_crapmunch" },
      {
        x: 1800, y: 0 + deltaYLocal, w: enemyWidth, h: enemyHeight,
         tex: imgCrap, tiles: { tilesX: 1, tilesY: 1 }, colectionLabel: "enemy_crapmunch" },
      {
        x: 1800, y: 300 + deltaYLocal, w: enemyWidth, h: enemyHeight,
         tex: imgCrap, tiles: { tilesX: 1, tilesY: 1 }, colectionLabel: "enemy_crapmunch"},
      {
        x: 1800, y: 800 + deltaYLocal, w: enemyWidth, h: enemyHeight,
         tex: imgCrap, tiles: { tilesX: 1, tilesY: 1 }, colectionLabel: "enemy_crapmunch" },
      {
        x: 1800, y: 1200 + deltaYLocal, w: enemyWidth, h: enemyHeight,
         tex: imgCrap, tiles: { tilesX: 1, tilesY: 1 }, colectionLabel: "enemy_crapmunch" },
      {
        x: 1800, y: 1800 + deltaYLocal, w: enemyWidth, h: enemyHeight,
         tex: imgCrap, tiles: { tilesX: 1, tilesY: 1 }, colectionLabel: "enemy_crapmunch"},
      {
        x: 2800, y: 250 + deltaYLocal, w: enemyWidth, h: enemyHeight,
         tex: imgCrap, tiles: { tilesX: 1, tilesY: 1 }, colectionLabel: "enemy_crapmunch" },
      {
        x: 2800, y: 3100 + deltaYLocal, w: enemyWidth, h: enemyHeight,
         tex: imgCrap, tiles: { tilesX: 1, tilesY: 1 }, colectionLabel: "enemy_crapmunch" },

    ] as ICollectionItem[];
  }

  public getDeadLines(): ICollectionEnemys[] {

    const img = [require("../imgs/flame2.png")];

    return [
      { x: 500, y: 2500, w: 9000, h: 50, tex: img, tiles:   { tilesX: 3, tilesY: 3 }, colectionLabel: "deadline" },
    ] as ICollectionEnemys[];
  }

  public getStaticBanners(): IStaticLabel[] {

    return [
      { x: 0, y: -120, w: 400, h: 50, text: "Collect virtual bitcoins", options: { color: "black" }},
      { x: -120, y: 170, w: 400, h: 150, text: "Welcome `Platformer` social chat app" , options: { color: "black" } },
      { x: -120, y: 210, w: 400, h: 100, text: "Created with visual ts game engine", options: { color: "black" } },
      { x: 1000, y: 900, w: 400, h: 100, text: "Run & explore", options: { color: "blue" } },
      { x: 1400, y: 200, w: 400, h: 100, text: "Love is in the air", options: { color: "red" } },
    ] as  IStaticLabel[];
  }

}
export default GameMap;
