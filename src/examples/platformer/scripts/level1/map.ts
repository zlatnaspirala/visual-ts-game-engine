import { staticItem, literalImageSrc } from "../../../../libs/types/global";

/**
 * Static body elements
 */

let imgRes: literalImageSrc = [
  require("../../imgs/floor.png"),
//  "../../imgs/target.png",
];

export const staticGrounds: staticItem[] = [
  {x: 50, y:90, w:50, h:5, tex: imgRes},
  {x: 10, y:10, w:30, h:5, tex: imgRes},
  {x: 110, y:30, w:30, h:5, tex: imgRes},
  {x: 70, y:60, w:30, h:10, tex: imgRes},
];
