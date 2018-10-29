
import "./icon/android-icon.png";
import Browser from "./libs/class/browser";

/**
 * Define all icons for application here.
 * In constructor and make it require
 * @param browser
 */
class AppIcon {

  constructor(browser: Browser) {

    require("./icon/favicon.ico");
    require("./icon/favicon-96x96.png");
    require("./icon/android-icon.png");
    require("./icon/permission/warning.png");
    require("./icon/permission/webcam.png");
    require("./icon/permission/gcheckmark.png");

  }

}
export default AppIcon;
