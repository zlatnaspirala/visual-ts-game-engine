/**
 * Import global css
 */
require("../../style/animations.css");
require("../../style/styles.css");

import AppIcon from "../../app-icon";
import Ioc from "../../controllers/ioc";
import GamePlay from "./scripts/game-play";

/**
 * @description
 * This instance use injected overrided config.
 */
import AppConfig from './ownConfig';

/**
 * plarformerGameInfo
 * This is strong connection.
 * html-components are on the same level with app.ts
 * Put any parameters here.
 */
const gameInfo = {
  name: "Basket Ball Chat",
  title: "Start Basket Ball Chat game play",
};

const gamesList: any[] = [
  gameInfo,
];

const master = new Ioc(gamesList, new AppConfig(gamesList));
const appIcons = [
  require("../../icon/favicon.ico"),
  require("../../icon/favicon-96x96.png"),
  require("../../icon/android-icon.png"),
  require("../../icon/apple-icon.png"),
];
const appIcon: AppIcon = new AppIcon(master.get.Browser, appIcons);
master.singlton(GamePlay, master.get.Starter);
console.log("root: ", master.get.GamePlay);

master.get.GamePlay.attachAppEvents();

/**
 * Make it global for fast access in console testing.
 * (window as any).platformer = master.get.GamePlay;
 */
(window as any).master = master;
(window as any).platformer = master.get.GamePlay;
