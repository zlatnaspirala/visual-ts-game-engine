/**
 * Import global css
 */
require("./../../../style/animations.css");
require("./../../../style/styles.css");

import AppIcon from "../../../app-icon";
import GamePlayController from "../../../controllers/ioc-single-player";
import Demo1 from "./demo";

/**
 * plarformerGameInfo
 * This is strong connection.
 * html-components are on the same level with app.ts
 * Put any parameters here.
 */
const gameInfo = {
  name: "Demo 1",
  title: "Start game play and add new element.",
};

const gamesList: any[] = [
  gameInfo,
];

const master = new GamePlayController(gamesList);
const appIcon: AppIcon = new AppIcon(master.get.Browser);
master.singlton(Demo1, master.get.Starter);
console.log("Starter : ", master.get.Demo1);

master.get.Demo1.attachAppEvents();

/**
 * Make it global for fast access in console testing.
 * (window as any).platformer = master.get.GamePlay;
 */
(window as any).master = master;
(window as any).demo1 = master.get.Demo1;
