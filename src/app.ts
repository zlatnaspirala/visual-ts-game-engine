/**
 * Import global css
 */
require("./style/styles.css");

import AppIcon from "./app-icon";
import Platformer from "./examples/platformer/platformer";
import Ioc from "./libs/ioc";

const master = new Ioc();
const appIcon: AppIcon = new AppIcon(master.get.Browser);

master.singlton(Platformer, master.get.Starter);

console.warn("Client browser: ", master.get.Browser.description);
