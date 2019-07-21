import { IConnectorMsg } from "../interface/global";

/**
 * Make all clear here
 */

// This is possible type of world element (bodies)
export type worldElement = Matter.MouseConstraint |
  Matter.Composite |
  Matter.Constraint |
  Matter.Body |
  Matter.Body[] |
  Matter.Composite[] |
  Matter.Constraint[];
export type drawableObject = HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap;
export type imagesResource = HTMLImageElement | HTMLImageElement[];
export type literalImageSrc = string | string[];

export type UniClick = MouseEvent | TouchEvent;
// tslint:disable-next-line:interface-over-type-literal
export type UniVector = { [key: string]: any };

export type Addson = Array<{ name: string, enabled: boolean, scriptPath: string }>;

// tslint:disable-next-line:interface-over-type-literal
export type NetMsg = { netPosition: {x: number, y: number}};
