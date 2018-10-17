
import Ioc from "./libs/ioc";

/**
 * Import global css
 */
require("./style/styles.css");

import AppIcon from "./app-icon";
import Platformer from "./examples/platformer/platformer";
// import "./libs/class/networking/rtc-multi-connection/RTCMultiConnection2";

require("./libs/class/networking/rtc-multi-connection/RTCMultiConnection2");
const master = new Ioc();

const appIcon: AppIcon = new AppIcon(master.get.Browser);

master.singlton(Platformer, master.get.Starter);
