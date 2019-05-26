/**
 * Import global css
 */
require("./style/styles.css");

import AppIcon from "./app-icon";
import GamePlay from "./examples/platformer/scripts/game-play";
import Ioc from "./libs/ioc";

/**
 * plarformerGameInfo
 * This is strong connection.
 * html-components are on the same level with app.ts
 * Put any parameters here.
 */
const plarformerGameInfo = {
  name: "Crypto-Runner",
  title: "PLAY PLATFORMER CRYPTO RUNNER!",
};

const gamesList: any[] = [
  plarformerGameInfo,
];

const master = new Ioc(gamesList);
const appIcon: AppIcon = new AppIcon(master.get.Browser);
master.singlton(GamePlay, master.get.Starter);
console.log("Platformer: ", master.get.GamePlay);

master.get.GamePlay.attachAppEvents();

window.platformer = master.get.GamePlay;

if ("serviceWorker" in navigator) {
  // Recommended to register onLoad
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("worker.js");
    console.log("log worker");
  });
}
