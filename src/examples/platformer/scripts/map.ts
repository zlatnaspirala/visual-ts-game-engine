import { ICollectionItem, IGamePlayPlatformerMap, IStaticItem, IStaticLabel, ICollectionEnemies } from "../../../libs/interface/global";

import generatedMap from "./packs/map2d"
/**
 * Static body elements, backgrounds, enemys returns
 * Prepared for next level, 'loading from generated content'
 * Path for images `../imgs/`
 * Inject or predefine here
 */

class GameMap implements IGamePlayPlatformerMap {

  private options: any = null;
  private staticGrounds: IStaticItem [] = [];
  private collectItems: ICollectionItem [] = [];
  private collectEnemies: ICollectionEnemies [] = [];

  constructor(options?: any) {

    // Options
    if (typeof options !== 'undefined') {
      this.options = options;
    }

    if (typeof generatedMap === 'undefined') return this;
    this.loadGeneratedMap();

  }

  /**
   * Important method, we call only if object
   * `generatedMap` is imported. I append generatedMap and object
   * `from code` created in same array.
   */
  private loadGeneratedMap() {

    const root = this;
    generatedMap.forEach(function(item) {

      if (typeof (item as ICollectionItem).colectionLabel !== 'undefined') {
        root.collectItems.push(item as ICollectionItem);
      } else if (typeof (item as ICollectionEnemies).enemyLabel !== 'undefined') {
        root.collectEnemies.push(item as ICollectionEnemies);
        console.log("next feature ENEMY");
      } else {
        root.staticGrounds.push(item);
      }

    });

  }

  public getStaticGrounds(): IStaticItem[] {

    const LocalWidth = 650;
    const imgRes = [require("../imgs/grounds/elementGlass019.png")];
    const imgResTest = [require("../imgs/grounds/floor2.png")];
    const tileXLocal = 10;

    // Simple manual input
    this.staticGrounds.push(
      { x: 100, y: 500, w: LocalWidth, h: 60, tex: imgRes, tiles: { tilesX: tileXLocal, tilesY: 1 } });
    return this.staticGrounds as IStaticItem[];

  }

  public getStaticBackgrounds(): IStaticItem[] {

    const backgroundDiameter = 1000;
    const backgroundWall = require("../imgs/backgrounds/wall3.png");
    // const backgroundWall = [require("../imgs/backgrounds/forest.png")];

    const shema = {
      byX: 8,
      byY: 4,
    };

    const subShema = {
      byX: 4,
      byY: 4,
    };

    const b: IStaticItem[] = [];
    for (let x = 0; x < shema.byX; x++) {
      for (let y = 0; y < shema.byY; y++) {
        b.push(
          {
            x: x * backgroundDiameter,
            y: y * backgroundDiameter,
            w: backgroundDiameter,
            h: backgroundDiameter,
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

    /**
     * @Description manual map data input
     * clear push array if you wanna only
     * game object from generated map.
     */
    /*
    this.collectItems.push(
      { x: 0, y: 0, w: 50, h: 60, tex: imgRes, tiles: { tilesX: 2, tilesY: 2 }, colectionLabel: "collectItemPoint", points: 2 },
      { x: 100, y: 0 + deltaYLocal, w: LocalWidth, h: 60, tex: imgRes, tiles: { tilesX: tileXLocal, tilesY: 1 }, colectionLabel: "collectItemPoint", points: 2 },
      { x: 100, y: 500 + deltaYLocal, w: LocalWidth, h: 60, tex: imgRes, tiles: { tilesX: tileXLocal, tilesY: 1 }, colectionLabel: "collectItemPoint", points: 2 },
    )
    */
    return this.collectItems as ICollectionItem[];
  }

  public getEnemys(): ICollectionEnemies[] {

    const imgCrap = [require("../imgs/enemies/crapmunch.png")];
    const imgCooper = [require("../imgs/enemies/chopper.png")];

    const deltaYLocal = 100;
    const enemyWidth = 100;
    const enemyHeight = 100;

    /*
    this.collectEnemies.push(
      {
        x: 0, y: -100 + deltaYLocal, w: enemyWidth, h: enemyHeight,
        tex: imgCrap, tiles: { tilesX: 1, tilesY: 1 }, enemyLabel: "crapmunch", enemyOptions: ""},
    );
    */
    return this.collectEnemies;
  }

  public getDeadLines(): ICollectionEnemies[] {

    const img = [require("../imgs/deadlines/flame2.png")];

    return [
      { x: 0, y: 4500, w: 9000, h: 50, tex: img, tiles:   { tilesX: 3, tilesY: 3 }, enemyLabel: "deadline", enemyOptions: "" },
    ] as ICollectionEnemies[];
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
