/**
 * Import global css
 */
require("./style/styles.css");

import AppIcon from "./app-icon";
import Platformer from "./examples/platformer/platformer";
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
master.singlton(Platformer, master.get.Starter);
console.log("Platformer: ", master.get.Platformer);

master.get.Platformer.attachAppEvents();

setTimeout(function () {
  // master.get.Platformer.destroyGamePlay();
}, 3000);
