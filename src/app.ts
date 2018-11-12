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
  name: "Platformer crypto runner",
  title: "PLAY PLATFORMER CRYPTO RUNNER!",
};

const gamesList: any[] = [
  plarformerGameInfo,
];

const master = new Ioc(gamesList);
const appIcon: AppIcon = new AppIcon(master.get.Browser);

master.singlton(Platformer, master.get.Starter);

console.warn("Platformer: ", master.get.Platformer);
