import { Addson } from "./types/global";

/**
 * ClientConfig is config file for whole client part of application.
 * It is a better to not mix with server config staff.
 * All data is defined like default private property values.
 * Use mmethod class to get proper.
 * Class don't have any args passed.
 */
class ClientConfig {

  /**
   * Addson
   */
  private addson: Addson = [
    {
      name: "hackerTimer",
      enabled: true,
      scriptPath: "externals/hack-timer.js",
    },
    {
      name: "dragging",
      enabled: true,
      scriptPath: "externals/drag.ts",
    },
  ];

  private drawReference: string = "frame"; // "diametric-fullscreen"; // "frame";

  /**
   * aspectRatio default value , can be changed in run time.
   */
  private aspectRatio: number = 1.333;

  /**
   * domain is simple url address,
   * recommendent to use for local propose LAN ip
   * like : 192.168.0.XXX if you wanna run ant test app with server.
   */
  private domain: string = "127.0.0.1";

  /**
   * networkDeepLogs control of dev logs.
   */
  private networkDeepLogs: boolean = false;

  /**
   * rtcServerPort Port used to connect multimedia server.
   * Default value is 12034
   */
  private rtcServerPort: number = 12034;

  /**
   * masterServerKey is channel access id used to connect
   * multimedia server channel.
   */
  private masterServerKey: string = "multi-platformer-sever1.maximum";

  /**
   * connectorPort is access port used to connect
   * session web socket.
   */
  private connectorPort: number = 1234;

  /**
   * appUseAccountsSystem If you don't want to use session
   * in your application just setup this variable to the false.
   */
  private appUseAccountsSystem: boolean = false;

  /**
   * Possible variant by default :
   * "register", "login"
   */
  private startUpHtmlForm: string = "register";

  private gameList: any[];

  /**
   * Implement default gamePlay variable's
   */
  private defaultGamePlayLevelName: string = "level1";
  private autoStartGamePlay: boolean = true;

  /**
   * constructor will save interest data for game platform
   */
  constructor(gameList: any[]) {

    // Interconnection Network.Connector vs app.ts
    this.gameList = gameList;

  }

  public getAddson(): Addson {
    return this.addson;
  }

  public getAutoStartGamePlay() {
    return this.autoStartGamePlay;
  }

  public getGamesList() {
    return this.gameList;
  }

  public getDefaultGamePlayLevelName(): string {
    return this.defaultGamePlayLevelName;
  }

  public isAppUseAccountsSystem(): boolean {
    return this.appUseAccountsSystem;
  }

  public getStartUpHtmlForm(): string {
    return this.startUpHtmlForm;
  }

  public getDomain() {
    return this.domain;
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

  public getRemoteServerAddressControlller() {
    return (location.protocol === "https:" ? "wss" : "ws") + "://" + document.domain + ":" + this.connectorPort + "/";
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
export default ClientConfig;
