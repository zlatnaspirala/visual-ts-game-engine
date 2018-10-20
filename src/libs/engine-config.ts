import { runInThisContext } from "vm";

class EngineConfig {

  private drawReference: string = "frame";
  private aspectRatio: number = 1.333;

  private networkDeepLogs: boolean = false;
  private remoteServerPort: number = 12034;

  private masterServerKey: string = "multi-platformer-sever1.maximum";

  constructor() {
    // no args
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
    return (location.protocol === "https:" ? "wss" : "ws") + "://" + document.domain + ":" + this.remoteServerPort + "/";
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
