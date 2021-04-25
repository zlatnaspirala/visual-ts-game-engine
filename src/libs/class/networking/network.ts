
import { byId, bytesToSize, getElement, getRandomColor, htmlHeader } from "../system";
import ConnectorClient from "./connector";
import * as RTCMultiConnection3 from "./rtc-multi-connection/RTCMultiConnection3";
import * as io from "./rtc-multi-connection/socket.io";

class Network {

  private popupUI: HTMLDivElement    | null = null;
  private broadcasterUI: HTMLElement | null = null;
  private titleStatus: HTMLElement   | null = null;
  private openRoomBtn: HTMLElement   | null = null;
  private joinRoomBtn: HTMLElement   | null = null;
  private leaveRoomBtn: HTMLElement  | null = null;
  private shareFileBtn: HTMLElement  | null = null;
  private inputChat: HTMLElement     | null = null;
  private inputRoomId: HTMLElement   | null = null;

  public injector: any;

  /**
   * @description
   * Deplaced from multiRTC2 but
   * prop still have the same name
   * rtcMultiConnection
   * No type definition for now.
   * @type RTCMultiConnection3
   */
  public rtcMultiConnection: any;
  private engineConfig: any;
  private connector: ConnectorClient;

  constructor(config: any) {

    this.engineConfig = config;
    if (this.engineConfig.didAppUseAccountsSystem()) {
      this.connector = new ConnectorClient(config);
      this.connector.showRegisterForm();
      this.popupUI = (byId("popup") as HTMLDivElement);
      this.popupUI.style.display = "block";
    }

    if (this.engineConfig.getNetworkDeepLog() === false) {
      (window as any).log = function () {/* empty */};
    }

    // console.log("MAKE IT PERFECT key is ", this.engineConfig.getMasterServerKey())

    // this.roomUI = this.engineConfig.getMasterServerKey();

    (window as any).io = io;

    this.engineConfig = config;
    if (this.engineConfig.getRunBroadcasterOnInt()) {
      require("../../../icon/permission/share-files.png");
      this.runCoordinator();
    }

  }

  private initDOM() {

    this.broadcasterUI = byId("media-rtc3-controls");
    this.titleStatus = byId("rtc3log");
    this.openRoomBtn = byId("open-room");
    this.joinRoomBtn = byId("join-room");
    this.openOrJoinBtn = byId("open-or-join-room");
    this.leaveRoomBtn = byId("btn-leave-room");
    this.shareFileBtn = byId("share-file");
    this.inputChat = byId("input-text-chat");
    this.inputRoomId = byId("room-id");

    this.openRoomBtnVisible(true);

  }

  private runCoordinator = () => {

    // root.rtcMultiConnection.onopen = function (e) {
      /* run injected handler
      if (root.injector) {
        console.log("inject exist", root.injector);
        root.injector.init(e);
      }*/
    /*
    root.rtcMultiConnection.onmessage = function (e) {
      if (e.data.netPos) {
          root.injector.update(e);
          return;
      }
      */
      // DESTROY NETPLAYER - event.userid
      // root.injector.leaveGamePlay(event);

        const myInstance = this;
        fetch("./templates/coordinator.html", {
          headers: htmlHeader,
        }).
          then(function (res) {
            return res.text();
          }).then(function (html) {
            // console.warn(html);
            myInstance.popupUI = byId("data-rtc3-controls") as HTMLDivElement;
            myInstance.popupUI.innerHTML = html;
    
            if (myInstance.engineConfig.getShowBroadcasterOnInt()) {
              myInstance.popupUI.style.display = "block";
            } else {
              myInstance.popupUI.style.display = "none";
            }
    
            myInstance.initDOM();
            myInstance.attachEvents();
            myInstance.initWebRtc();
            myInstance.inputRoomId.nodeValue = myInstance.engineConfig.getMasterServerKey();
    
            if (myInstance.engineConfig.getBroadcastAutoConnect()) {
    
              // myInstance.inputRoomId.nodeValue = myInstance.engineConfig.getMasterServerKey();
              myInstance.openOrJoinBtn.click();
            }
    
          });
    
      }

  }

  private attactLoggerUI() {
    const root = this;
    //  const websocket = new WebSocket(root.engineConfig.getRemoteServerAddress());
    };
  }

}
export default Network;
