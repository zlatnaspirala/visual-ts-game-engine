import { Addson } from "./libs/types/global";
import { IBroadcasterSession } from "./libs/interface/global";

/**
 * ClientConfig is config file for whole client part of application.
 * It is a better to not mix with server config staff.
 * All data is defined like default private property values.
 * Use mmethod class to get proper.
 * Class don't have any args passed.
 */
class ClientConfig {

   /**
   * Addson - Role is : "no dependencies scripts only"
   * All addson are ansync loaded scripts.
   *  - hackerTimer is for better performace also based on webWorkers. Load this script on top.
   *  - Cache is based on webWorkers.
   *  - dragging is script for dragging dom elements taken from stackoverflow.com.
   *  - facebook addson is simple fb api implementation.
   *  - adapter is powerfull media/communication fixer(Objective : working on all moder browsers).
   */
  private addson: Addson = [
    {
      name: "cache",
      enabled: true,
      scriptPath: "externals/cacheInit.ts",
    },
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
    {
      name: "adapter",
      enabled: true,
      scriptPath: "externals/adapter.js",
    },
    {
      name: "facebook",
      enabled: true,
      scriptPath: "externals/fb.js",
    }
  ];

  /**
   * @description This is main coordinary types of positions
   * Can be "diametric-fullscreen" or "frame".
   *  - diametric-fullscreen is simple fullscreen canvas element.
   *  - frame keeps aspect ratio in any aspect.
   * @property drawReference
   * @type  string
   */
  private drawReference: string = "frame";

  /**
   * aspectRatio default value, can be changed in run time.
   * This is 800x600, 1.78 is also good fit for lot of desktop monitors screens
   */
  private aspectRatio: number = 1.333;

  /**
   * domain is simple url address,
   * recommendent to use for local propose LAN ip
   * like : 192.168.0.XXX if you wanna run ant test app with server.
   */
  private domain: string = "maximumroulette.com";

  /**
   * @description Important note for this property: if you
   * disable (false) you cant use Account system or any other
   * network. Use 'false' if you wanna make single player game.
   * In other way keep it 'true'.
   */
  private appUseNetwork = true;

  /**
   * networkDeepLogs control of dev logs for webRTC context only.
   */
  private networkDeepLogs: boolean = false;

  /**
   * masterServerKey is channel access id used to connect
   * multimedia server channel.Both multiRTC2/3
   */
  private masterServerKey: string = "maximumroulette.server1";

  /**
   * rtcServerPort Port used to connect multimedia server.
   * Default value is 12034
   */
  private rtcServerPort: number = 12034;

  /**
   * connectorPort is access port used to connect
   * session web socket.
   */
  private connectorPort: number = 1234;

  /**
   * appUseAccountsSystem If you don't want to use session
   * in your application just setup this variable to the false.
   */
  private appUseAccountsSystem: boolean = true;

  /**
   * appUseBroadcaster Disable or enable broadcaster for
   * video chats.
   */
  private appUseBroadcaster: boolean = true;
  /**
   * broadcasterPort Port used to connect multimedia server MultiRTC3.
   * I will use it for explicit video chat multiplatform support.
   * Default value is 9001
   */
  private broadcasterPort: number = 9001;

  /**
   * broadcaster socket.io address.
   * Change it for production regime
   */
  private broadcastSockRoute: string = "http://localhost:9001/";

  /**
   * broadcaster socket.io address.
   * Change it for production regime
   */
  private broadcastAutoConnect: boolean = false;

  /**
   * runBroadcasterOnInt load broadcaster
   */
  private runBroadcasterOnInt: boolean = true;

  public showBroadcasterOnInt: boolean = true;

  /**
   * broadcaster rtc session init values.
   * Change it for production regime
   */
  private broadcasterSessionDefaults: IBroadcasterSession = {
    sessionAudio: true,
    sessionVideo: true,
    sessionData: true,
    enableFileSharing: true
  };

  private stunList: string[] = [
    "stun:stun.l.google.com:19302",
    "stun:stun1.l.google.com:19302",
    "stun:stun.l.google.com:19302?transport=udp"
  ];
  /**
   * Possible variant by default :
   * "register", "login"
   */
  private startUpHtmlForm: string = "register";

  private gameList: any[];

  /**
   * Implement default gamePlay variable's
   */
  private defaultGamePlayLevelName: string = "public";
  private autoStartGamePlay: boolean = false;

  /**
   * constructor will save interest data for game platform
   */
  constructor(gameList: any[]) {

    // Interconnection Network.Connector vs app.ts
    this.gameList = gameList;

  }

  public getRunBroadcasterOnInt() :boolean {
    return this.runBroadcasterOnInt;
  }

  public getBroadcastAutoConnect(): boolean {
   return this.broadcastAutoConnect;
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

  public didAppUseNetwork() {
    return this.appUseNetwork;
  }

  public didAppUseAccountsSystem(): boolean {
    return this.appUseAccountsSystem;
  }

  public didAppUseBroadcast(): boolean {
    return this.appUseBroadcaster;
  }

  public getStunList(): string[] {
    return this.stunList;
  }

  public getBroadcastSockRoute(): string {
    return this.broadcastSockRoute;
  }

  public getStartUpHtmlForm(): string {
    return this.startUpHtmlForm;
  }

  public getDomain() {
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      return window.location.hostname;
    }
    return this.domain;
  }

  public getBroadcasterPort() {
    return this.broadcasterPort;
  }

  public getBroadcasterSessionDefaults() {
    return this.broadcasterSessionDefaults;
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

  public getProtocolFromAddressBar(): string {
    return (location.protocol === "https:" ? "https://" : "http://");
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
