/**
 * Import global css
 */
require("./../../../style/animations.css");
require("./../../../style/styles.css");

import AppIcon from "../../../app-icon";
import GamePlayController from "../../../controllers/ioc-single-player";
import DemoSpriteAnimation from "./demo";

/**
 * plarformerGameInfo
 * This is strong connection.
 * html-components are on the same level with app.ts
 * Put any parameters here.
 */
const gameInfo = {
  name: "Sprite animation Demo",
  title: "Start game play and add new sprite element.",
};

const gamesList: any[] = [
  gameInfo,
];

const master = new GamePlayController(gamesList);

const appIcons = [
  require("./icon/favicon.ico"),
  require("./icon/favicon-96x96.png"),
  require("./icon/android-icon.png"),
  require("./icon/apple-icon.png"),
];

const appIcon: AppIcon = new AppIcon(master.get.Browser, appIcons);

master.singlton(DemoSpriteAnimation, master.get.Starter);
console.log("Starter : ", master.get.Demo1);

master.get.DemoSpriteAnimation.attachAppEvents();

/**
 * Make it global for fast access in console testing.
 * (window as any).platformer = master.get.GamePlay;
 */
(window as any).master = master;
(window as any).DemoSpriteAnimation = master.get.Demo1;
