
import { 
  ICollectionEnemies,
  ICollectionItem,
  IGamePlayPlatformerMap,
  IStaticItem,
  IStaticLabel
 } from "./../../libs/interface/global";

/**
 * @implements IGamePlayPlatformerMap
 * @description
 * Static body elements, backgrounds, enemys returns
 * 'loading from generated content' Done
 * Path for images `../imgs/`
 * Inject or predefine here
 */
class MapLoader implements IGamePlayPlatformerMap {

  private options: any = {};
  
  protected staticBackgrounds: IStaticItem [] = [];
  protected staticGrounds: IStaticItem [] = [];
  protected collectItems: ICollectionItem [] = [];
  protected collectEnemies: ICollectionEnemies [] = [];
  protected collectLabels: IStaticLabel [] = [];

  constructor(options?: any) {
    if (typeof options !== "undefined") {
      this.options.mapPack = options;
      this.loadGeneratedMap(this.options.mapPack);
      console.info("Map -> loadGeneratedMap loaded.")
    }
  }

  /**
   * @description
   * Overide usage.
   * @returns IStaticItem[]
   */
  public getStaticGrounds(): IStaticItem[] {
    return this.staticGrounds as IStaticItem[];
  }

  /**
   * @description
   * Overide usage.
   * @returns IStaticItem[]
   */
  public getStaticBackgrounds(): IStaticItem[] {
    return this.staticBackgrounds as IStaticItem[];
  }

  /**
   * @description
   * Overide usage.
   * @returns ICollectionItem[]
   */
  public getCollectItems(): ICollectionItem[] {
    return this.collectItems as ICollectionItem[];
  }

  /**
   * @description
   * Overide usage.
   * @returns ICollectionEnemies[]
   */
  public getEnemys(): ICollectionEnemies[] {
    return this.collectEnemies;
  }

  /**
   * @description
   * Overide usage.
   * @returns ICollectionEnemies[]
   */
  public getDeadLines(): ICollectionEnemies[] {
    return [] as ICollectionEnemies[];
  }

  /**
   * @description
   * Overide usage
   * @returns IStaticLabel[]
   */
  public getStaticBanners(): IStaticLabel[] {
    return this.collectLabels as  IStaticLabel[];
  }

  /**
   * @description
   * @type private
   * @returns void
   * Most important method, we call only if object
   * `generatedMap` is imported. I append generatedMap and object
   * `from code` created in same array.
   */
  private loadGeneratedMap(gMap) {

    const root = this;
    gMap.forEach(function (item) {

      if (typeof (item  as any | ICollectionItem).colectionLabel !== "undefined") {
        root.collectItems.push(item  as any | ICollectionItem);
      } else if (typeof (item  as any | ICollectionEnemies).enemyLabel !== "undefined") {
        root.collectEnemies.push(item  as any | ICollectionEnemies);
      } else if (typeof (item as any | IStaticLabel).text !== "undefined") {
        root.collectLabels.push((item as any));
      } else {
        root.staticGrounds.push((item  as any));
      }

    });

  }

}
export default MapLoader;
