
import { byId, bytesToSize, getElement, getRandomColor, htmlHeader } from "../system";
import ConnectorClient from "./connector";
import Coordinator from "./coordinator";
import * as RTCMultiConnection3 from "./rtc-multi-connection/RTCMultiConnection3";
import * as io from "./rtc-multi-connection/socket.io";

class Network {

  private popupUI: HTMLDivElement    | null = null;
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
      console.info("App use session network (connector).");
    }

    if (this.engineConfig.getNetworkDeepLog() === false) {
      (window as any).log = function () {/* empty */};
    }

    console.log("App network: ", this.engineConfig.getMasterServerKey());
    // this.roomUI = this.engineConfig.getMasterServerKey();
    (window as any).io = io;

    // nooption for no loading
    this.rtcMultiConnection = new Coordinator(this.engineConfig);
    (window as any).rtcMultiConnection = this.rtcMultiConnection;
    require("../../../icon/permission/share-files.png");

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

  }
    //  const websocket = new WebSocket(root.engineConfig.getRemoteServerAddress());


}
export default Network;
