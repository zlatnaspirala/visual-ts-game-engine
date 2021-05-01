/**
 * @description
 * Import global css
 */
require("./style/animations.css");
require("./style/styles.css");

import AppIcon from "./app-icon";
import Ioc from "./controllers/ioc";
import GamePlay from "./examples/platformer/scripts/game-play";

/**
 * @description
 * plarformerGameInfo
 * This is strong connection.
 * html-components are on the same level with app.ts
 * Put any parameters here.
 */
const plarformerGameInfo = {
  name: "Platformer",
  title: "Start Platformer game play",
};

const gamesList: any[] = [
  plarformerGameInfo,
];

const master = new Ioc(gamesList);

const appIcons = [
  "./icon/favicon.ico",
  "./icon/favicon-96x96.png",
  "./icon/android-icon.png",
  "./icon/apple-icon.png",
  "./icon/permission/warning.png",
  "./icon/permission/gcheckmark.png"];
const appIcon: AppIcon = new AppIcon(master.get.Browser, appIcons);

master.singlton(GamePlay, master.get.Starter);
console.log("Platformer: ", master.get.GamePlay);

master.get.GamePlay.attachAppEvents();

/**
 * Make it global for fast access in console testing.
 * (window as any).platformer = master.get.GamePlay;
 */
(window as any).master = master;
(window as any).platformer = master.get.GamePlay;
