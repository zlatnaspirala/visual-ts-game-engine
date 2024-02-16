
import ClientConfig from "../../../client-config";
import { DEFAULT_NETWORK_PARAMS } from "../../defaults";
import { BaseMultiPlayer } from "../../interface/networking";
import { byId, createAppEvent, htmlHeader } from "../system";
import "./rtc-multi-connection/FileBufferReader.js";
import { getHTMLMediaElement } from "./rtc-multi-connection/getHTMLMediaElement";
import * as RTCMultiConnection3 from "./rtc-multi-connection/RTCMultiConnection3";
import * as io from "./rtc-multi-connection/socket.io";

class Coordinator {

  public injector: BaseMultiPlayer;
  public openOrJoinBtn: HTMLElement;
  public connection: any;

  private engineConfig: ClientConfig;
  private popupUI: HTMLDivElement    | null = null;
  private broadcasterUI: HTMLElement | null = null;
  private titleStatus: HTMLElement   | null = null;
  private openRoomBtn: HTMLElement   | null = null;
  private joinRoomBtn: HTMLElement   | null = null;
  private leaveRoomBtn: HTMLElement  | null = null;
  private shareFileBtn: HTMLElement  | null = null;
  private inputChat: HTMLElement     | null = null;
  private inputRoomId: HTMLElement   | null = null;
  openDataSession: () => void;

  constructor(config: any) {

    (window as any).io = io;

    this.engineConfig = config;
    if (this.engineConfig.getRunBroadcasterOnInt()) {
      require("../../../icon/permission/share-files.png");
      this.runBroadcaster();
    }

    return this;
  }

  public closeAllPeers(): void {
    this.connection.close();
  }

  public openRoomBtnVisible = (visible: boolean) => {

    if (visible === true) {
      byId("open-room-data").classList.remove("hide");
    } else {
      byId("open-room-data").classList.add("hide");
    }

  }

  public activateDataStream (multiPlayerRef: BaseMultiPlayer) {
    setTimeout(() => {
      this.injector = multiPlayerRef;
      this.openOrJoinBtn.click();
    }, DEFAULT_NETWORK_PARAMS.SYNTETIC_ASYNC_DELAY_INTERVAL );
  }
  
  private initDOM() {

    this.broadcasterUI = byId("data-rtc3-controls");
    this.titleStatus = byId("rtc3log-data");
    this.openRoomBtn = byId("open-room-data");
    this.joinRoomBtn = byId("join-room-data");
    this.openOrJoinBtn = byId("open-or-join-room-data");
    this.leaveRoomBtn = byId("btn-leave-room-data");
    this.shareFileBtn = byId("share-file-data");
    this.inputChat = byId("input-text-chat-data");
    this.inputRoomId = byId("room-id-data");

    this.openRoomBtnVisible(true);

  }

  private streamLoaded(userId, streamAccess) {

    const broadcasterStreamLoaded = createAppEvent("stream-loaded", {
      streamId: streamAccess,
      userId,
    });
    (window as any).dispatchEvent(broadcasterStreamLoaded);
    return streamAccess;
  }

  private initWebRtc = (options?) => {

    const root = this;

    this.connection = new (RTCMultiConnection3 as any)();
    this.connection.socketURL = root.engineConfig.getCoordinatorSockRoute();
    this.connection.socketMessageEvent = "audio-video-file-chat-demo";

    if (typeof options !== "undefined") {
      // by default, it is "false".
      this.connection.enableFileSharing = options.enableFileSharing;

      this.connection.session = {
        audio: options.session.audio,
        video: options.session.video,
        data: options.session.data,
      };

    } else {

    this.connection.enableFileSharing = root.engineConfig.getCoordinatorConfig().enableFileSharing;

    this.connection.session = {
        audio: root.engineConfig.getCoordinatorConfig().sessionAudio,
        video: root.engineConfig.getCoordinatorConfig().sessionVideo,
        data: root.engineConfig.getCoordinatorConfig().sessionData,
      };

    }

    this.connection.sdpConstraints.mandatory = {
      OfferToReceiveAudio: true,
      OfferToReceiveVideo: true,
    };

    this.connection.iceServers = [{
      urls: root.engineConfig.getStunList(),
    }];

    this.connection.videosContainer = byId("videos-container-data") as HTMLDivElement;
    this.connection.videosContainer.style.display = "none";
    this.connection.videosContainer.setAttribute("style", "position:absolute;left:0;top:0;width:400px;height:300px;");

    this.connection.onstream = function (event) {

      event.mediaElement.removeAttribute("src");
      event.mediaElement.removeAttribute("srcObject");
      const video = document.createElement("video");
      video.controls = true;
      if (event.type === "local") {
          video.muted = true;
      }
      video.srcObject = event.stream;

      const localNumberCW = root.connection.videosContainer.clientWidth;
      const width: number = parseInt(localNumberCW.toString(), 10);

      const mediaElement = getHTMLMediaElement(video, {
        title: event.userid,
        buttons: ["full-screen"],
        width,
        showOnMouseEnter: false,
      });

      root.connection.videosContainer.appendChild(mediaElement);

      const dragging = function () {

        return {
          move (divid, xpos, ypos) {
            divid.style.left = xpos + "px";
            divid.style.top = ypos + "px";
          },
          startMoving (divid, container, evt?) {
            evt = evt || window.event;
            const posX = evt.clientX,
              posY = evt.clientY,
              eWi = parseInt(divid.style.width, 10),
              eHe = parseInt(divid.style.height, 10),
              cWi = parseInt((document.getElementById(container) as any).style.width, 10),
              cHe = parseInt((document.getElementById(container) as any).style.height, 10);

            let divTop = divid.style.top,
              divLeft = divid.style.left;

            (document.getElementById(container) as any).style.cursor = "move";
            divTop = divTop.replace("px", "");
            divLeft = divLeft.replace("px", "");
            const diffX = posX - divLeft,
              diffY = posY - divTop;

            // tslint:disable-next-line: no-shadowed-variable
            document.onmousemove = function (event) {

              const e = event || window.event;
              let aX, aY;
              try {
                aX = event.clientX - diffX,
                aY = event.clientY - diffY;
              } catch (err) {
                console.log(err);
              }
              if (aX < 0) { aX = 0; }
              if (aY < 0) { aY = 0; }
              if (aX + eWi > cWi) { aX = cWi - eWi; }
              if (aY + eHe > cHe) { aY = cHe - eHe; }
              dragging.move(divid, aX, aY);
            };
          },
          stopMoving (container) {
            const a = document.createElement("script");
            (document.getElementById(container) as any).style.cursor = "default";
            // document.onmousemove = function () {};
            (document as any).onmousemove = undefined;
          },
        };
      }();

      // tslint:disable-next-line: no-shadowed-variable
      mediaElement.onmousedown = function (event) {
        dragging.startMoving(this, "videos-container", event);
      };

      // tslint:disable-next-line: no-shadowed-variable
      mediaElement.onmouseup  = function (event) {
        dragging.stopMoving("videos-container");
      };

      setTimeout(function () {
        (mediaElement as any).media.play();
      }, 4000);

      mediaElement.id = event.streamid;

      root.streamLoaded(event.userid, event.streamid);

    };

    this.connection.onstreamended = function (event) {
      const mediaElement = document.getElementById(event.streamid);
      if (mediaElement) {
        mediaElement.parentNode.removeChild(mediaElement);
      }
    };

    this.connection.onmessage = root.appendDIV;

    this.connection.filesContainer =   byId("file-container-data");

    this.connection.onopen = function (e) {

      (root.shareFileBtn as HTMLInputElement).disabled = false;
      (root.inputChat as HTMLInputElement).disabled = false;
      (root.leaveRoomBtn as HTMLInputElement).disabled = false;

      if (root.injector) {
        root.injector.init(e);
      }

      console.info( "COORDINATOR You are connected with: " +
        root.connection.getAllParticipants().join(", "));

        (document.querySelector("#rtc3log-data") as HTMLInputElement).innerHTML = "You are connected with: " +
        root.connection.getAllParticipants().join(", ");
    };

    // No override ask stackoverflow community
    this.connection.onerror = function(error) {
      if (!!this.enableLogs) {
          console.error(error.userid, '<err>', error);
      }
    };

    this.connection.onclose = function (dataStreamEvent) {
      console.log(' onClose ->>>>>>>>>>>>>>> dataStreamEvent ', dataStreamEvent)
      root.injector.leaveGamePlay(dataStreamEvent);
      if (root.connection.getAllParticipants().length) {
        (document.querySelector("#rtc3log") as HTMLInputElement).value = "You are still connected with:" +
          root.connection.getAllParticipants().join(", ");
      } else {
        (document.querySelector("#rtc3log") as HTMLInputElement).value = "Seems session has been closed or all participants left.";
      }
    };

    this.connection.onEntireSessionClosed = function (event) {

      (root.shareFileBtn as HTMLInputElement).disabled = true;
      (root.inputChat as HTMLInputElement).disabled = true;
      (root.leaveRoomBtn as HTMLInputElement).disabled = true;
      (root.openOrJoinBtn as HTMLInputElement).disabled = false;
      (root.openRoomBtn as HTMLInputElement).disabled = false;
      (root.inputRoomId as HTMLInputElement).disabled = false;
      (root.inputRoomId as HTMLInputElement).disabled = false;

      root.connection.attachStreams.forEach(function (stream) {
          stream.stop();
      });

      // don't display alert for moderator
      if (root.connection.userid === event.userid) { return; }
      (document.querySelector("#rtc3log") as HTMLInputElement).innerHTML = "Entire session has been closed by the moderator: " + event.userid;
    };

    this.connection.onUserIdAlreadyTaken = function (useridAlreadyTaken) {
      // seems room is already opened
      root.connection.join(useridAlreadyTaken);
    };

    this.postAttach();

  }

  private showRoomURL(roomid) {
    console.info('entering in room...', roomid);
    return;
    /*
    const roomHashURL = "#" + roomid;
    const roomQueryStringURL = "?roomid=" + roomid;

    let html = "<h2>Unique URL for your room:</h2><br>";

    html +=
      '<a href="' + roomHashURL + '" target="_blank">' + roomHashURL + "</a>";
    html += "<br>";
    html +=
      '<a href="' +
      roomQueryStringURL +
      '" target="_blank">' +
      roomQueryStringURL +
      "</a>";

    const roomURLsDiv = document.getElementById("room-urls");
    (roomURLsDiv as HTMLDivElement).innerHTML = html;
    (roomURLsDiv as HTMLDivElement).style.display = "block";
    */
  }
  
  private disableInputButtons = () => {

    (this.openOrJoinBtn as HTMLInputElement).disabled = true;
    (this.openRoomBtn as HTMLInputElement).disabled = true;
    (this.inputRoomId as HTMLInputElement).disabled = true;
    (this.inputRoomId as HTMLInputElement).disabled = true;
    (this.leaveRoomBtn as HTMLInputElement).disabled = false;

  };

  private appendDIV = (event) => {

    if (event.data && event.data.netPos) {
      this.injector.update(event);
      return;
    }

    const div = document.createElement("div");
    div.innerHTML = event.data || event;
    const chatContainer = document.querySelector(".chat-output-data") as HTMLDivElement;
    chatContainer.insertBefore(div, chatContainer.firstChild);
    div.tabIndex = 0;
    div.focus();
    (document.getElementById("input-text-chat-data") as HTMLInputElement).focus();

  }

  private postAttach() {

    const root = this;
    // tslint:disable-next-line:no-var-keyword
    var roomid = "";
    if (localStorage.getItem(root.connection.socketMessageEvent)) {
      roomid = localStorage.getItem(root.connection.socketMessageEvent as string);
    } else {
      roomid = root.connection.token();
    }

    if (root.engineConfig.getMasterServerKey()) {
      roomid = root.engineConfig.getMasterServerKey() + "-data-channel";
    }

    (root.inputRoomId as HTMLInputElement).value = roomid;
    (root.inputRoomId as HTMLInputElement).onkeyup = function () {
      localStorage.setItem(root.connection.socketMessageEvent, (this as HTMLInputElement).value);
    };

    let hashString = location.hash.replace("#", "");
    if (hashString.length && hashString.indexOf("comment-") === 0) {
      hashString = "";
    }

    roomid = (window as any).params.roomid;
    if (!roomid && hashString.length) {
        roomid = hashString;
    }

    if (roomid && roomid.length) {
      (root.inputRoomId as HTMLInputElement).value = roomid;
      localStorage.setItem(root.connection.socketMessageEvent, roomid);

      // auto-join-room
      (function reCheckRoomPresence() {
        root.connection.checkPresence(roomid, function (isRoomExists) {
          if (isRoomExists) {
            root.connection.join(roomid);
            return;
          }

          setTimeout(reCheckRoomPresence, 5000);
        });
      })();

      root.disableInputButtons();
    }
  }

  private attachEvents() {
    console.log('TEST attachEvents')
    const root = this;
    (window as any).enableAdapter = true;

    // hide right box (broadcaster)
    root.titleStatus.onclick = function () {
      if (root.broadcasterUI.classList.contains("network-panel-show-ver-animation")) {
      root.broadcasterUI.classList.remove("network-panel-show-ver-animation");
      root.broadcasterUI.classList.add("network-panel-hide-ver-animation");
      root.titleStatus.innerHTML = `N`;
      } else {
      root.broadcasterUI.classList.add("network-panel-show-ver-animation");
      root.broadcasterUI.classList.remove("network-panel-ver-hide-animation");
      root.titleStatus.innerHTML = `Networking`;
      }
    };

    root.openRoomBtn.onclick = function () {
        root.disableInputButtons();
        root.connection.open((root.inputRoomId as HTMLInputElement).value, function () {
            root.showRoomURL(root.connection.sessionid);
        });
    };

    root.joinRoomBtn.onclick = function () {
        root.disableInputButtons();
        root.connection.join((root.inputRoomId as HTMLInputElement).value);
    };

    root.openDataSession = function () {
      root.disableInputButtons();
      root.connection.openOrJoin((root.inputRoomId as HTMLInputElement).value,
        function (isRoomExists, roomid) {
          if (!isRoomExists) {
            root.showRoomURL(roomid);
          }
        });
    };

    root.openOrJoinBtn.onclick = root.openDataSession;

    (root.leaveRoomBtn as HTMLButtonElement).onclick = function () {
        (this as HTMLButtonElement).disabled = true;

        if (root.connection.isInitiator) {
            // use this method if you did NOT set "autoCloseEntireSession===true"
            // for more info: https://github.com/muaz-khan/RTCMultiConnection#closeentiresession
            root.connection.closeEntireSession(function () {
                (document.querySelector("#rtc3log") as HTMLHeadingElement).innerHTML = "Entire session has been closed.";
            });
        } else {
            root.connection.leave();
        }
    };

    // ................FileSharing/TextChat Code.............
    root.shareFileBtn.onclick = function () {
        const fileSelector = new (window as any).FileSelector();
        fileSelector.selectSingleFile(function (file) {

            root.connection.send(file);
        });
    };

    (root.inputChat as HTMLInputElement).onkeyup = function (e) {
        // tslint:disable-next-line:triple-equals
        if (e.keyCode != 13) { return; }

        // removing trailing/leading whitespace
        (this as HTMLInputElement).value = (this as HTMLInputElement).value.replace(/^\s+|\s+$/g, "");
        if (!(this as HTMLInputElement).value.length) { return; }

        root.connection.send((this as HTMLInputElement).value);
        root.appendDIV((this as HTMLInputElement).value);
        (this as HTMLInputElement).value = "";
    };

    // Handling Room-ID
    (function () {
        const params = {},
          r = /([^&=]+)=?([^&]*)/g;

        function d(s) {
          return decodeURIComponent(s.replace(/\+/g, " "));
        }
        // tslint:disable-next-line:prefer-const
        let match, search = window.location.search;
        // tslint:disable-next-line: no-conditional-assignment
        while (match = r.exec(search.substring(1))) {
          params[d(match[1])] = d(match[2]);
        }
        (window as any).params = params;
    })();

  }

  private runBroadcaster = () => {

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

        /**
         * @description
         * If you want activation gameplay on user action
         * than use `BroadcastAutoConnect = false`
         * If you wanna direct opening gameplay then use `true`
         */
        if (myInstance.engineConfig.getBroadcastAutoConnect()) {
          console.log("myInstance.openDataSession(); from COORDINATOR getBroadcastAutoConnect ")
          myInstance.openDataSession();
        }

      });

  }

}
export default Coordinator;
