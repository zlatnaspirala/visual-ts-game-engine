import ClientConfig from "../../client-config";

/**
 * ClientConfig used already from ./src
 * Here make override what ever you want
 */
class AppConfig extends ClientConfig {
 
  constructor(gameList: any) {
    super(gameList)
    console.info("Make changes on Application Config with override what ever you want.")
  }

  /**
   * @description I wanna free for all this instance.
   */
  public didAppUseAccountsSystem(): boolean {
    return false;
  }

}
export default AppConfig;
