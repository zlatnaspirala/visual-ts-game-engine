/**
 * Make all clear here
 */

 // This is possible type of world element (bodies)
export type worldElement = Matter.MouseConstraint | Matter.Composite | Matter.Constraint | Matter.Body | Matter.Body[] | Matter.Composite[] | Matter.Constraint[];
export type drawableObject = HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap;
export type imagesResource =  HTMLImageElement |  HTMLImageElement[];
export type literalImageSrc = string | string[];
export type staticItem = {x: number,y: number, w: number, h:number, tex: literalImageSrc, tiles: number};
export type uniVector = {[key: string]: any};
