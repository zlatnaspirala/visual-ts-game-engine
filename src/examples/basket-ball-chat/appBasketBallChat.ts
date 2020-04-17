/**
 * Import global css
 */
require("../../style/animations.css");
require("../../style/styles.css");

import AppIcon from "../../app-icon";
import Ioc from "../../controllers/ioc";
import GamePlay from "./scripts/game-play";

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

const master = new Ioc(gamesList);
const appIcon: AppIcon = new AppIcon(master.get.Browser);
master.singlton(GamePlay, master.get.Starter);
console.log("root: ", master.get.GamePlay);

master.get.GamePlay.attachAppEvents();

/**
 * Make it global for fast access in console testing.
 * (window as any).platformer = master.get.GamePlay;
 */
(window as any).master = master;
(window as any).platformer = master.get.GamePlay;
