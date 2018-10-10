import { IStaticItem, literalImageSrc } from "../../../../libs/types/global";

/**
 * Static body elements
 */

const imgRes: literalImageSrc = [
  require("../../imgs/floor.png"),
  //  "../../imgs/target.png",
];

export const staticGrounds: IStaticItem[] = [
  { x: 50, y: 90, w: 60, h: 6, tex: imgRes, tiles: 10 },
  { x: 10, y: 10, w: 30, h: 6, tex: imgRes, tiles: 5 },
  { x: 110, y: 30, w: 30, h: 6, tex: imgRes, tiles: 5 },
  { x: 70, y: 60, w: 30, h: 6, tex: imgRes, tiles: 5 },
];
