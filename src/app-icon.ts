
import "./icon/android-icon.png";
import Browser from "./libs/class/browser";

/**
 * Define all icons for application here.
 * In constructor and make it require
 * @param browser
 */
class AppIcon {

  constructor(browser: Browser, iconsAsset?: string[]) {
    iconsAsset.forEach((icon)=>{
      require(icon);
    });
  }

}
export default AppIcon;
