
import MapLoader from "../../../libs/class/map-loader";
import { 
  ICollectionEnemies,
  ICollectionItem,
  IGamePlayPlatformerMap,
  IStaticItem,
  IStaticLabel } from "../../../libs/interface/global";

/**
 * @descripiton
 * Static body elements, backgrounds, enemys returns objects.
 * 'loading from generated content' Done.
 *  Path for images `../imgs/`
 *  Inject or predefine world element here.
 */
class GameMap extends MapLoader implements IGamePlayPlatformerMap {

  constructor(options?: any) {
    super(options)
  }

  public getStaticGrounds(): IStaticItem[] {

    // Add bonus objects then return all
    // const LocalWidth = 650;
    // const imgRes = [require("../imgs/grounds/elementGlass019.png")];
    // const tileXLocal = 10;

    // this.staticGrounds.push(
    //   { x: 100, y: 600, w: LocalWidth, h: 60, tex: imgRes, tiles: { tilesX: tileXLocal, tilesY: 1 } });

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
    for (let x = 550; x < shema.byX; x++) {
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
    /**
     * @Description manual map data input
     * clear push array if you wanna only
     * game object from generated map.
     */
    /*
    const LocalWidth = 60;
    const tileXLocal = 1;
    const deltaYLocal = -200;
    const imgRes = [require("../imgs/collect-items/bitcoin.png")];
    this.collectItems.push(
      { x: 0, y: 0, w: 50, h: 60, tex: imgRes, tiles: { tilesX: 2, tilesY: 2 }, colectionLabel: "collectItemPoint", points: 2 },
      { x: 100, y: 0 + deltaYLocal, w: LocalWidth, h: 60, tex: imgRes, tiles: { tilesX: tileXLocal, tilesY: 1 }, colectionLabel: "collectItemPoint", points: 2 },
      { x: 100, y: 500 + deltaYLocal, w: LocalWidth, h: 60, tex: imgRes, tiles: { tilesX: tileXLocal, tilesY: 1 }, colectionLabel: "collectItemPoint", points: 2 },
    )
    */
    return this.collectItems as ICollectionItem[];
  }

  /**
   *@description
   * In origin with out special overload
   * get functions just returns already loaded 
   * items from map.
   */
  public getEnemys(): ICollectionEnemies[] {
    /*
      const imgCrap = [require("../imgs/enemies/crapmunch.png")];
      const imgCooper = [require("../imgs/enemies/chopper.png")];
      const deltaYLocal = 100;
      const enemyWidth = 100;
      const enemyHeight = 100;
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
      { x: 0, y: 2500, w: 9000, h: 50, tex: img, tiles:   { tilesX: 3, tilesY: 3 }, enemyLabel: "deadline", enemyOptions: "" },
    ] as ICollectionEnemies[];

  }

  public getStaticBanners(): IStaticLabel[] {

    (this.collectLabels as any).forEach(function (item, i, array) {

      array[i].x = parseFloat(array[i].x);
      array[i].y = parseFloat(array[i].y);
      array[i].w = 200.0;
      array[i].h = 150;
      if (typeof  array[i].options === "undefined") {
         array[i].options = {
           color: "lime",
           size: 20,
         };
      }
      array[i].options.color = (item as any).textColor;
      array[i].options.size = (item as any).textSize;

    });

    this.collectLabels.push(
      { x: 2220, y: 500, w: 400, h: 150,
        text: "Visual-ts Video Chat gameplay",
        options: {
          color: "black",
          size: 20,
          font: "70px stormfaze"
        },
      }
    );

    this.collectLabels.push(
      { x: 2220, y: 600, w: 400, h: 150,
        text: "Real time protocols vs physics",
        options: {
          color: "black",
          size: 20,
          font: "70px wargames"
        },
      }
    );

    this.collectLabels.push(
      { x: 3220, y: 300, w: 400, h: 150,
        text: "Public chat",
        options: {
          color: "#124784",
          size: 30,
        },
      }
    );

    return this.collectLabels as  IStaticLabel[];
  }

}
export default GameMap;
