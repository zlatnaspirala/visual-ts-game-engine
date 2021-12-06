/**
 * Import global css
 */
require("./style/animations.css");
require("./style/styles.css");

import AppIcon from "./app-icon";
import GamePlay from "./examples/platformer-single-player/scripts/game-play";
// tslint:disable-next-line: ordered-imports
import Ioc from "./controllers/ioc-single-player";

/**
 * plarformerGameInfo
 * This is strong connection.
 * html-components are on the same level with app.ts
 * Put any parameters here.
 */
const plarformerGameInfo = {
  name: "Platformer Single Player",
  title: "Start Platformer game",
};

const gamesList: any[] = [
  plarformerGameInfo,
];

const master = new Ioc(gamesList);

const appIcons = [
  require("./icon/favicon.ico"),
  require("./icon/favicon-96x96.png"),
  require("./icon/android-icon.png"),
  require("./icon/apple-icon.png"),
];

const appIcon: AppIcon = new AppIcon(master.get.Browser, appIcons);
master.singlton(GamePlay, master.get.Starter);
console.log("Platformer single player: ", master.get.GamePlay);

master.get.GamePlay.attachAppEvents();

/**
 * Make it global for fast access in console testing.
 * (window as any).platformer = master.get.GamePlay;
 */
(window as any).master = master;
(window as any).platformer = master.get.GamePlay;
