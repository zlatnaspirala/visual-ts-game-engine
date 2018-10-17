
import "./icon/android-icon.png";
import Browser from "./libs/class/browser";

class AppIcon {

  private name: string;

  constructor(browser: Browser) {

    require("./icon/favicon.ico");
    require("./icon/favicon-96x96.png");
    require("./icon/android-icon.png");

  }

}
export default AppIcon;
