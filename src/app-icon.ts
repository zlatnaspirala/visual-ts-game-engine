
import "./icon/android-icon.png";
import Browser from "./libs/class/browser";

/**
 * Define all icons for application here.
 * In constructor and make it require
 * @param browser
 */
class AppIcon {

  private icons: any[] = [];
  constructor(browser: Browser, iconsAsset?: string[]) {
    const root = this;
    iconsAsset.forEach((icon)=>{
      root.icons.push(icon);
    });
  }

}
export default AppIcon;
