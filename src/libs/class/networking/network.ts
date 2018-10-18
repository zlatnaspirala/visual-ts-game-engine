
import EngineConfig from "../../engine-config";
import { byId, getElement, getRandomColor } from "../system";
// import { RTCMultiConnection } from "./rtc-multi-connection/RTCMultiConnection3";
import "./rtc-multi-connection/RTCMultiConnection2";
import "./test/ui.peer-connection";
// import "./test/ui.share-files";

class Network {

  private type: string = "multiRtc";
  private rtcMultiConnection: any;
  private engineConfig: EngineConfig;
  private loggerUI: HTMLDivElement;
  private webSocketData: WebSocket;
  private webSocketRTC: WebSocket;
  private webCamView: HTMLDivElement;
  private mainChannel: string;
  private numbersOfUsers: number = 0;

  private NameUI: HTMLInputElement;
  private roomUI: HTMLInputElement;
  private senderUI: HTMLTextAreaElement;
  private connectUI: HTMLButtonElement;
  private getUserinfo;
  private fireClickEvent;

  constructor(config: EngineConfig) {

    this.engineConfig = config;
    this.loggerUI = byId("log-network") as HTMLDivElement;
    this.NameUI = this.loggerUI.querySelector("#your-name");
    this.roomUI = this.loggerUI.querySelector("#room-name");
    this.connectUI = this.loggerUI.querySelector("#continue");
    this.senderUI = byId("sender") as HTMLTextAreaElement;

    this.attactLogger();

    this.rtcMultiConnection = rtcMultiConnection;

  }

  private attactLogger() {
    const root = this;

    this.NameUI.onkeyup = (e) => {
      if (e.keyCode !== 13) { return; }
      root.connectUI.onclick(event as MouseEvent);
    };

    this.roomUI.onkeyup = function (e) {
      if (e.keyCode !== 13) { return; }
      root.connectUI.onclick();
    };

    // this.roomUI.value = ;

    if (localStorage.getItem("roomname")) {
      this.roomUI.value = localStorage.getItem("roomname");
    }

    this.roomUI.onkeyup = function () {
      localStorage.setItem("roomname", root.roomUI.value);
    };

    this.connectUI.onclick = function (ev) {

      if (!root.roomUI.value || root.roomUI.value.length === 0) {
        root.roomUI.focus();
        return alert("Enter secure channel code!");
      }

      root.roomUI.onkeyup();

      root.NameUI.disabled = root.NameUI.disabled = (this as any).disabled = true;
      const username = root.NameUI.value || "Anonymous";

      (rtcMultiConnection as any).extra = {
        username,
        color: getRandomColor(),
      };

      root.addNewMessage({
        header: username,
        message: "Searching for existing rooms...",
        userinfo: '<img src="images/action-needed.png">',
      });

      const roomid = root.roomUI.value;
      (rtcMultiConnection as any).channel = root.roomUI.value;

      const websocket = new WebSocket(root.engineConfig.getRemoteServerAddress());
      websocket.onmessage = function (event) {
        const data = JSON.parse(event.data);
        if (data.isChannelPresent === false) {
          root.addNewMessage({
            header: username,
            // tslint:disable-next-line:max-line-length
            message: "No room.Creating new room" + root.roomUI.value,
            userinfo: '<img src="./../../../icon/permission/warning.png">',
          });

          (rtcMultiConnection as any).open();
        } else {
          root.addNewMessage({
            header: username,
            message: "Room found. Joining the room...",
            userinfo: '<img src="./../../../icon/permission/warning.png">',
          });
          (rtcMultiConnection as any).join(root.roomUI.value);
        }
      };
      websocket.onopen = function () {
        websocket.send(JSON.stringify({
          checkPresence: true,
          channel: root.roomUI.value,
        }));
      };
    };

    this.getUserinfo = (blobURL, imageURL) => {
      return blobURL ? '<video src="' + blobURL + '" autoplay controls></video>' : '<img src="' + imageURL + '">';
    };

    let isShiftKeyPressed = false;

    this.senderUI.onkeydown = function (e) {
      if (e.keyCode === 16) {
        isShiftKeyPressed = true;
      }
    };

    let numberOfKeys = 0;
    this.senderUI.onkeyup = function (e) {
      numberOfKeys++;
      if (numberOfKeys > 3) { numberOfKeys = 0; }

      if (!numberOfKeys) {
        if (e.keyCode === 8) {
          return (rtcMultiConnection as any).send({
            stoppedTyping: true,
          });
        }

        (rtcMultiConnection as any).send({
          typing: true,
        });
      }

      if (isShiftKeyPressed) {
        if (e.keyCode === 16) {
          isShiftKeyPressed = false;
        }
        return;
      }

      if (e.keyCode !== 13) { return; }

      root.addNewMessage({
        header: (rtcMultiConnection as any).extra.username,
        message: "Your Msg:" + (window as any).linkify(root.senderUI.value),
        userinfo: root.getUserinfo((rtcMultiConnection as any).blobURLs[(rtcMultiConnection as any).userid], "images/chat-message.png"),
        color: (rtcMultiConnection as any).extra.color,
      });

      (rtcMultiConnection as any).send(root.senderUI.value);
      (byId("sender") as HTMLButtonElement).value = "";

    };

    getElement("#allow-webcam").onclick = () => {
      this.disabled = true;

      const session = { audio: true, video: true };

      rtcMultiConnection.captureUserMedia(function (stream) {
        const streamid = rtcMultiConnection.token();
        rtcMultiConnection.customStreams[streamid] = stream;

        rtcMultiConnection.sendMessage({
          hasCamera: true,
          streamid,
          session,
        });
      }, session);
    };

    getElement("#allow-mic").onclick = () => {
      this.disabled = true;
      const session = { audio: true };

      root.rtcMultiConnection.captureUserMedia(function (stream) {
        const streamid = root.rtcMultiConnection.token();
        root.rtcMultiConnection.customStreams[streamid] = stream;

        root.rtcMultiConnection.sendMessage({
          hasMic: true,
          streamid,
          session,
        });
      }, session);
    };

    getElement("#allow-screen").onclick = function () {
      this.disabled = true;
      const session = { screen: true };

      this.rtcMultiConnection.captureUserMedia(function (stream) {
        const streamid = root.rtcMultiConnection.token();
        root.rtcMultiConnection.customStreams[streamid] = stream;

        root.rtcMultiConnection.sendMessage({
          hasScreen: true,
          streamid,
          session,
        });
      }, session);
    };

    getElement("#share-files").onclick = function () {
      const file = document.createElement("input");
      file.type = "file";

      file.onchange = function () {
        rtcMultiConnection.send(this.files[0]);
      };
      this.fireClickEvent(file);
    };

    this.fireClickEvent = (element) => {
      const evt = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
      });

      element.dispatchEvent(evt);
    };

  }

  private addNewMessage(args) {

    const newMessageDIV = document.createElement("div");
    newMessageDIV.className = "new-message";

    const userinfoDIV = document.createElement("div");
    userinfoDIV.className = "user-info";
    userinfoDIV.innerHTML = args.userinfo || '<img src="images/user.png">';

    userinfoDIV.style.background = args.color || this.rtcMultiConnection.extra.color || getRandomColor();

    newMessageDIV.appendChild(userinfoDIV);

    const userActivityDIV = document.createElement("div");
    userActivityDIV.className = "user-activity";

    userActivityDIV.innerHTML = '<h2 class="header">' + args.header + "</h2>";

    const p = document.createElement("p");
    p.className = "message";
    userActivityDIV.appendChild(p);
    p.innerHTML = args.message;

    newMessageDIV.appendChild(userActivityDIV);

    this.loggerUI.insertBefore(newMessageDIV, this.loggerUI.firstChild);

    userinfoDIV.style.height = newMessageDIV.clientHeight + "px";

    if (args.callback) {
      args.callback(newMessageDIV);
    }

    // document.querySelector("#message-sound").play();
  }

}
export default Network;
