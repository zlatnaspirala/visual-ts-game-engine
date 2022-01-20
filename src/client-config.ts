import { IBroadcasterSession } from "./libs/interface/networking";
import { Addson } from "./libs/types/global";

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
      enabled: false,
      scriptPath: "externals/cacheInit.ts",
    },
    {
      name: "hackerTimer",
      enabled: true,
      scriptPath: "externals/hack-timer.js",
    },
    {
      name: "dragging",
      enabled: false,
      scriptPath: "externals/drag.ts",
    },
    {
      name: "adapter",
      enabled: true,
      scriptPath: "externals/adapter.js",
    },
    {
      name: "facebook",
      enabled: false,
      scriptPath: "externals/fb.js",
    },
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
   * @description
   * Default setup is `dev`.
   * recommendent to use for local propose LAN ip
   * like : 192.168.0.XXX if you wanna run ant test app with server.
   */
  private domain: string = "maximumroulette.com";
  // private domain: string = "localhost";

  /**
   * @description Important note for this property: if you
   * disable (false) you can't use Account system or any other
   * network. Use 'false' if you wanna make single player game.
   * In other way keep it 'true'.
   */
  private appUseNetwork:boolean = true;

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
   * @description
   * Enable Disable coordinator flag
   */
  private appUseCoordinator: boolean = false;

  /**
   * @description
   * Coordinator rtc3 session init values.
   * Downgrade to data only.
   */
  private coordinatorSessionDefaults: IBroadcasterSession = {
    sessionAudio: false,
    sessionVideo: false,
    sessionData: true,
    enableFileSharing: false,
  };

  /**
   * connectorPort is access port used to connect
   * session web socket.
   * Take high number for port to avoid
   * `code: 'EACCES', errno: -4092, syscall: 'listen'
   * for localhost usage.
   */
  private connectorPort: number = 9010;

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
   * @description
   * broadcasterPort Port used to connect multimedia server MultiRTC3.
   * I will use it for explicit video chat multiplatform support.
   * Default value is 9001
   */
  private broadcasterPort: number = 9001;

  private showBroadcasterOnInt: boolean = true;

  /**
   * @description
   * broadcaster socket.io address.
   * Change it for production regime
   */
  private broadcastAutoConnect: boolean = false;

  /**
   * @description
   * runBroadcasterOnInt load broadcaster
   */
  private runBroadcasterOnInt: boolean = true;

  /**
   * @description
   * broadcaster rtc session init values.
   * Change it for production regime
   */
  private broadcasterSessionDefaults: IBroadcasterSession = {
    sessionAudio: true,
    sessionVideo: true,
    sessionData: true,
    enableFileSharing: true,
  };

  /**
   * @description
   * Optimal for dev stage.
   * read more about webRtc protocols.
   * Recommended: coturn open source project.
   */
  private stunList: string[] = [
    "stun:stun.l.google.com:19302",
    "stun:stun1.l.google.com:19302",
    "stun:stun.l.google.com:19302?transport=udp",
  ];

  /**
   * @description
   * Possible variant by default:
   * "register", "login"
   */
  private startUpHtmlForm: string = "register";

  private controls: {} = {
    platformerPlayerController: true,
    enableMobileControlsOnDesktop: true,
  };

  private gameList: any[];

  /**
   * @description
   * Implement default gamePlay variable's
   */
  private defaultGamePlayLevelName: string = "public";
  private autoStartGamePlay: boolean = false;

  /**
   * @description
   * constructor will save interest data for game platform
   * For now it is just name of the game. I use it in
   * pre gameplay UI game selector.
   */
  constructor(gameList: any[]) {

    // Interconnection Network.Connector vs app.ts
    this.gameList = gameList;

  }

  public didAppUseCoordinator() {
    if (this.appUseBroadcaster === true) {
      console.warn("App already use broadcaster stream. Running double multiPeer connections is extreme situation.");
    }
    return this.appUseCoordinator;
  }

  public getCoordinatorConfig() {
    return this.coordinatorSessionDefaults
  }

  public getcontrols(): any {
    return this.controls;
  }

  public getShowBroadcasterOnInt ():boolean {
    return this.showBroadcasterOnInt;
  }

  public getRunBroadcasterOnInt(): boolean {
    return this.runBroadcasterOnInt;
  }

  public getBroadcastAutoConnect(): boolean {
   return this.broadcastAutoConnect;
  }

  public getAddson(): Addson {
    return this.addson;
  }

  public getAutoStartGamePlay(): boolean {
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
    return this.getProtocolFromAddressBar() +  this.getDomain() + ":" + this.broadcasterPort + "/";
  }

  public getCoordinatorSockRoute(): string {
    return this.getProtocolFromAddressBar() +  this.getDomain() + ":" + this.rtcServerPort + "/";
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
    return ( (location.protocol === "https:") ? "wss" : "ws") + "://" + document.domain + ":" + this.connectorPort + "/";
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
