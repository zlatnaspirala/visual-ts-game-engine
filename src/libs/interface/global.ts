// import Resources from "../class/resources";
import { Counter } from "../class/math";
import SpriteTextureComponent from "../class/visual-methods/sprite-animation";
import TextureComponent from "../class/visual-methods/texture";
import Starter from "../starter";
import { imagesResource, literalImageSrc, UniVector, worldElement, worldElementParams } from "../types/global";
import { Addson } from "../types/global";
import { IBroadcasterSession } from "./networking";

export interface IPoint {
  x: number;
  y: number;
}

export interface IDimensions {
  w: number;
  h: number;
}

export interface ISound {
  name: string;
  createAudio: (path, idCaller, loop?, autoplay?) => void;
}

export enum worldElementType {
  RECT = "rect",
  CIRCLE = "circle"
}

export interface GeneratorOptions {
  genType: worldElementType,
  emit: number[],
  counter: Counter,
  newParamsElement: worldElementParams,
  starter: Starter,
  destroyAfter: number,
}

export interface ICollisionFilter {
  category: number;
  group: number;
  mask: number;
}

export interface IUniVector {
  [key: string]: any;
}

export interface ISelectedPlayer {
  labelName: string;
  poster: imagesResource;
  resource: imagesResource[];
  type: string;
  spriteTile?: {key: { byX: number, byY: number }} | any;
  spriteTileCurrent: string;
  texCom?: undefined | SpriteTextureComponent | TextureComponent;
  setCurrentTile(index: string): void;
}

export interface IStaticItem {
  x: number; y: number; w: number; h: number;
  tex: literalImageSrc;
  tiles: { tilesX: number, tilesY: number};
  collisionFilter?: ICollisionFilter;
}

export interface IStaticLabel {
  x: number; y: number; w: number; h: number;
  text: string;
  options: {
    color: string;
    size: number;
  };
}

export interface ICollectionItem extends IStaticItem {
  colectionLabel: string;
  points: number;
}

export interface IBotBehaviorOptions {
  patrolType: string;
  patrolPeriod: number;
  patrolLoop: boolean;
}

// Remove any at the end
export interface ICollectionEnemies extends IStaticItem {
  enemyLabel: string;
  enemyOptions: IBotBehaviorOptions | any;
}

export interface ISpriteShema {
  byX: number;
  byY: number;
}

export interface IUserRegData {
  email: string;
  password: string;
}

export interface IConnectorMsg {
  action: string;
  data: UniVector;
 }

export interface IMessageReceived {
  action: string;
  data: any;
}

export interface IGamePlayModel {
   gameName: string;
   version: number;
   starter: Starter;
   player: any;
}

export interface IGamePlayModelNoPlayer {
  gameName: string;
  version: number;
  starter: Starter;
}

export interface IGamePlayPlatformerMap {
  getStaticGrounds(): IStaticItem[];
  getStaticBackgrounds(): IStaticItem[];
  getCollectItems(): ICollectionItem[];
  getEnemys(): ICollectionEnemies[];
}

/**
 * @description
 * ClientConfig is config file for whole client part of application.
 * It is a better to not mix with server config staff.
 * All data is defined like default property values.
 * Use mmethod class to get proper.
 * Class don't have any args passed.
 */
export interface IClientConfig {

  recordCanvasOption: object;
  getcontrols(): any;
  getShowBroadcasterOnInt (): boolean;
  getRunBroadcasterOnInt(): boolean;
  getBroadcastAutoConnect(): boolean;
  getAddson(): Addson;
  getAutoStartGamePlay(): boolean;
  getGamesList(): any;
  getDefaultGamePlayLevelName(): string;
  didAppUseNetwork(): boolean;
  didAppUseAccountsSystem(): boolean;
  didAppUseBroadcast(): boolean;
  getStunList(): string[];
  getBroadcastSockRoute(): string;
  getStartUpHtmlForm(): string;
  getDomain():any;
  getBroadcasterPort(): number;
  getBroadcasterSessionDefaults(): IBroadcasterSession;
  getConnectorPort(): number;
  getDrawRefference(): string;
  getAspectRatio(): number;
  setAspectRatio(newAspectRatio: number): void;
  getProtocolFromAddressBar(): string;
  getRemoteServerAddress(): string;
  getRemoteServerAddressControlller(): string;
  setNetworkDeepLog(newState: boolean): void;

  /**
   * @description
   * Syntetic for now.
   * for future importing log system from old visualjs.
   * With nice color chema.
   */
  getNetworkDeepLog(): boolean;

  /**
   * @description
   * getMasterServerKey is initially uniq options for
   * our channel name of broadcasting.
   */
  getMasterServerKey(): string;

}

export interface IRecordCanvasModule {
  recordCanvas: any;
}
