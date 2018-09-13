/** Import css */
require("./styles/styles.css");
require("./styles/favicon.ico");
require("./styles/android-icon.png");

import Platformer from "./examples/platformer/platformer";
import Ioc from "./libs/ioc";

const master = new Ioc();
master.singlton(Platformer, master.get.Starter);
