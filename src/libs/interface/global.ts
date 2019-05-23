import Starter from "../starter";
import { literalImageSrc, worldElement } from "../types/global";

export interface ICollisionFilter { category: number; group: number; mask: number; }
export interface IStaticItem {
  x: number; y: number; w: number; h: number;
  tex: literalImageSrc; tiles: number; collisionFilter?: ICollisionFilter;
}
export interface IUniVector { [key: string]: any; }

export interface ICollectionItem extends IStaticItem {
  colectionLabel: string;
  points: number;
}

export interface ISpriteShema {
  byX: number;
  byY: number;
}

export interface IUserRegData {
  email: string;
  password: string;
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
