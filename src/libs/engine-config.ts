class EngineConfig {

  private drawReference: string = "frame";
  private aspectRatio: number = 1.333;

  private remoteServer;

  constructor() {
    // empty for now
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
    return (location.protocol === "https:" ? "wss" : "ws") + "://" + document.domain + ":12034/";
  }

}
export default EngineConfig;
