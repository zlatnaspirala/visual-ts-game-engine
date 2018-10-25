import { runInThisContext } from "vm";
const serverConfig = require("../../server-config.js");

class EngineConfig {

  private drawReference: string = "frame";
  private aspectRatio: number = 1.333;

  private networkDeepLogs: boolean = false;
  private rtcServerPort: number = 12034;
  private masterServerKey: string = "multi-platformer-sever1.maximum";
  private connectorPort: number = 1234;

  private appUseAccountsSystem: boolean = true;

  constructor() {
    // no args
  }

  public isAppUseAccountsSystem(): boolean {
    return this.appUseAccountsSystem;
  }

  public getConnectorPort() {
    return this.connectorPort;
  }

  public getDrawRefference(): string {
    return this.drawReference;
  }

  public getAspectRatio(): number {
    return this.aspectRatio;
  }

  public setAspectRatio(newAspectRatio: number) {
    this.aspectRatio = newAspectRatio;
  }

  public getRemoteServerAddress() {
    return (location.protocol === "https:" ? "wss" : "ws") + "://" + document.domain + ":" + this.rtcServerPort + "/";
  }

  public setNetworkDeepLog(newState: boolean) {
    this.networkDeepLogs = newState;
  }

  public getNetworkDeepLog(): boolean {
    return this.networkDeepLogs;
  }

  public getMasterServerKey(): string {
    return this.masterServerKey;
  }

}
export default EngineConfig;
