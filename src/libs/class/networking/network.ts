
import { byId, bytesToSize, getElement, getRandomColor } from "../system";
import ConnectorClient from "./connector";
import "./rtc-multi-connection/linkify";
import "./rtc-multi-connection/RTCMultiConnection2";

class Network {

  public injector: any;

  public rtcMultiConnection: any;
  private engineConfig: any;
  private popupUI: HTMLDivElement;
  private loggerUI: HTMLDivElement;
  private loggerMediaUI: HTMLDivElement;
  private webCamView: HTMLDivElement;
  private numbersOfUsers: number = 0;

  private nameUI: HTMLInputElement;
  private roomUI: HTMLInputElement;
  private senderUI: HTMLTextAreaElement;
  private connectUI: HTMLButtonElement;
  private chatUI: HTMLDivElement;
  private whoIsTyping: HTMLDivElement;
  private getUserinfo;
  private fireClickEvent;

  private connector: ConnectorClient;

  constructor(config: any) {

    this.engineConfig = config;

    if (this.engineConfig.didAppUseAccountsSystem()) {
      this.connector = new ConnectorClient(config);
      this.connector.showRegisterForm();
      this.popupUI = (byId("popup") as HTMLDivElement);
      this.popupUI.style.display = "block";
    }

    this.loggerUI = byId("network-panel") as HTMLDivElement;
    this.loggerMediaUI = byId("media-rtc2-controls") as HTMLDivElement;
    // Only for old versions of browsers in aspect of video chat implementation.
    // this.loggerMediaUI.style.display = "block";
    this.loggerUI.style.display = "block";
    this.webCamView = byId("webCamView") as HTMLDivElement;
    this.webCamView.style.display = "block";
    this.senderUI = byId("sender") as HTMLTextAreaElement;
    this.nameUI = this.loggerUI.querySelector("#your-name");
    this.roomUI = this.loggerUI.querySelector("#room-name");
    this.connectUI = this.loggerUI.querySelector("#continue");
    this.whoIsTyping = this.loggerUI.querySelector("#who-is-typing");
    this.chatUI = this.loggerUI.querySelector("#log-chat");

    if (this.engineConfig.getNetworkDeepLog() === false) {
      (window as any).log = function () {/* empty */};
    }

    this.roomUI.value = this.engineConfig.getMasterServerKey();
    this.roomUI.style.display = "none";
    this.attactLoggerUI();

    (window as any).rtcMultiConnection = new (window as any).RTCMultiConnection();
    this.rtcMultiConnection = (window as any).rtcMultiConnection;
    this.rtcMultiConnection.session = { data: true };
    this.rtcMultiConnection.sdpConstraints.mandatory = {
      OfferToReceiveAudio: true,
      OfferToReceiveVideo: true,
    };

    this.attachWebRtc();

    this.attachShareFiles();

    this.attachUIEvents();

  }

  private attachUIEvents() {
    // tslint:disable-next-line:prefer-const
    let leftBox = byId("display-network-panel");
    leftBox.addEventListener("click", this.toggleDisplayNetworkPanel, false);
  }

  private toggleDisplayNetworkPanel(e: MouseEvent) {
    // renderRegime="normal"
    const rRegime =  (e.currentTarget as HTMLElement).parentElement;
    // if (rRegime.getAttribute("renderRegime") == "normal")

    if (rRegime.getAttribute("renderRegime") === "normal") {
      (e.currentTarget as HTMLElement).parentElement.classList.remove("network-panel-show-animation");
      (e.currentTarget as HTMLElement).parentElement.classList.add("network-panel-hide-animation");
      rRegime.setAttribute("renderRegime", "leftBottom");
    } else {
      (e.currentTarget as HTMLElement).parentElement.classList.add("network-panel-show-animation");
      (e.currentTarget as HTMLElement).parentElement.classList.remove("network-panel-hide-animation");
      rRegime.setAttribute("renderRegime", "normal");
    }
  }

  private ReconnectAndJoinGameChannel() {

    const root = this;
    (window as any).rtcMultiConnection = new (window as any).RTCMultiConnection();
    this.rtcMultiConnection = (window as any).rtcMultiConnection;
    this.rtcMultiConnection.session = { data: true };
    this.rtcMultiConnection.sdpConstraints.mandatory = {
      OfferToReceiveAudio: true,
      OfferToReceiveVideo: true,
    };

    this.attachWebRtc();
    setTimeout(function () {
      root.connectUI.click();
    }, 2300);

  }
  private attachShareFiles() {
    /*
     * File sharing
     */
    const progressHelper = {};
    this.rtcMultiConnection.onFileStart = function (file) {
      this.addNewMessage({
        header: this.rtcMultiConnection.extra.username,
        message: "<strong>" + file.name + "</strong> ( " + bytesToSize(file.size) + " )",
        userinfo: this.getUserinfo(this.rtcMultiConnection.blobURLs[this.rtcMultiConnection.userid], "imgs/share-files.png"),
        callback(div) {
          const innerDiv = document.createElement("div");
          innerDiv.title = file.name;
          innerDiv.innerHTML = "<label>0%</label><progress></progress>";
          div.querySelector(".message").appendChild(innerDiv);
          progressHelper[file.uuid] = {
            div: innerDiv,
            progress: innerDiv.querySelector("progress"),
            label: innerDiv.querySelector("label"),
          };
          progressHelper[file.uuid].progress.max = file.maxChunks;
        },
      });
    };
    this.rtcMultiConnection.onFileProgress = function (chunk) {
      const helper = progressHelper[chunk.uuid];
      if (!helper) { return; }
      helper.progress.value = chunk.currentPosition || chunk.maxChunks || helper.progress.max;
      updateLabel(helper.progress, helper.label);
    };

    // www.RTCMultiConnection.org/docs/onFileEnd/
    this.rtcMultiConnection.onFileEnd = function (file) {
      if (!progressHelper[file.uuid]) {
        console.error("No such progress-helper element exists.", file);
        return;
      }
      let div = progressHelper[file.uuid].div;
      if (file.type.indexOf("image") !== -1) {
        div.innerHTML = '<a href="' + file.url + '" download="' + file.name + '">Download<strong class="myButtonChat" >' +
          file.name + '</strong> </a><br /><img src="' + file.url + '" title="' + file.name + '" style="max-width: 80%;">';
      } else {
        div.innerHTML = '<a href="' + file.url + '" download="' + file.name + '">Download <strong class="myButtonChat" >' +
          file.name + '</strong> </a><br /><iframe src="' + file.url + '" title="' + file.name +
          '" style="width: 80%;border: 0;height: inherit;margin-top:1em;"></iframe>';
      }

      setTimeout(function () {
        div = div.parentNode.parentNode.parentNode;
        div.querySelector(".user-info").style.height = div.querySelector(".user-activity").clientHeight + "px";
      }, 10);
    };

    function updateLabel(progress, label) {
      if (progress.position === -1) { return; }
      const position = +progress.position.toFixed(2).split(".")[1] || 100;
      label.innerHTML = position + "%";
    }

  }

  private attachWebRtc() {

    const root = this;

    this.rtcMultiConnection.openSignalingChannel = function (config) {

      console.info("webRTC config : ", config);
      config.channel = config.channel || this.channel;
      this.webSocket = new WebSocket(root.engineConfig.getRemoteServerAddress());
      this.webSocket.channel = config.channel;

      this.webSocket.onopen = function () {

        this.push(JSON.stringify({
          open: true,
          channel: config.channel,
        }));
        if (config.callback) {
          config.callback(this);
        }

      };

      this.webSocket.onmessage = function (event) {

        config.onmessage(JSON.parse(event.data));
      };

      this.webSocket.push = this.webSocket.send;

      this.webSocket.send = function (data) {

        if (this.readyState !== 1) {
        //  return //setTimeout(function () {
            try {
              this.send(data);
              return;
            } catch (e) {
              return;
            }

         // }, 100);
        }

        this.push(JSON.stringify({
          data,
          channel: config.channel,
        }));

      };
    };

    root.rtcMultiConnection.customStreams = {};

    /*
      http://www.rtcmulticonnection.org/docs/fakeDataChannels/
      rtcMultiConnection.fakeDataChannels = true;
      if(rtcMultiConnection.UA.Firefox) {
        rtcMultiConnection.session.data = true;
      }
    */

    root.rtcMultiConnection.autoTranslateText = false;

    root.rtcMultiConnection.onopen = function (e) {

      getElement("#allow-webcam").disabled = false;
      getElement("#allow-mic").disabled = false;
      getElement("#share-files").disabled = false;
      getElement("#allow-screen").disabled = false;

      console.log("chennel opened:", e);

      // run injected handler
      if (root.injector) {

        console.log("inject exist", root.injector);
        root.injector.init(e);

      }

      root.addNewMessage({
        header: e.extra.username,
        message: "line opened between you and " + e.extra.username + ".",
        userinfo: root.getUserinfo(root.rtcMultiConnection.blobURLs[root.rtcMultiConnection.userid], "./imgs/gcheckmark.png"),
        color: e.extra.color,
      });

      root.numbersOfUsers++;

    };

    const whoIsTyping = document.querySelector("#who-is-typing");
    root.rtcMultiConnection.onmessage = function (e) {

      if (e.data.netPos) {
          root.injector.update(e);
          return;
      }

      if (e.data.typing) {
        whoIsTyping.innerHTML = e.extra.username + " is typing ...";
        return;
      }

      if (e.data.stoppedTyping) {
        whoIsTyping.innerHTML = "";
        return;
      }

      whoIsTyping.innerHTML = "";

      root.addNewMessage({
        header: e.extra.username,
        message: e.extra.username + ":"
          + (root.rtcMultiConnection.autoTranslateText ? (window as any).linkify(e.data)
            + "(" + (window as any).linkify(e.original) + ")" : (window as any).linkify(e.data)),
        userinfo: "", // getUserinfo(root.rtcMultiConnection.blobURLs[e.userid], "./imgs/gcheckmark.png"),
        color: e.extra.color,
      });
      document.title = e.data;
    };

    const sessions = {};
    root.rtcMultiConnection.onNewSession = function (session) {

      if (sessions[session.sessionid]) { return; }
      sessions[session.sessionid] = session;

      session.join();

      console.log("New session");
      root.addNewMessage({
        header: session.extra.username,
        message: "Making handshake with room owner!",
        userinfo: '<img src="imgs/share-files.png">',
        color: session.extra.color,
      });
    };

    root.rtcMultiConnection.onRequest = function (request) {
      root.rtcMultiConnection.accept(request);
      root.addNewMessage({
        header: "New Participant",
        message: "Accepting request of " + request.extra.username + " ( " + request.userid + " )...",
        userinfo: "",
        color: request.extra.color,
      });
    };

    root.rtcMultiConnection.onCustomMessage = function (message) {

      if (message.hasCamera || message.hasScreen) {
        let msg = 'enabled webcam. <button id="preview" class="myButtonChat" >Preview</button>' +
          '<button class="myButton" id="share-your-cam">Share webcam</button>';

        if (message.hasScreen) {
          msg = 'Share screen <button id="preview"  class="myButtonChat">Remote screen</button>' +
            '<button id="share-your-cam" class="myButtonChat">Share screen</button>';
        }

        root.addNewMessage({
          header: message.extra.username,
          message: msg,
          userinfo: '<img src="imgs/share-files.png">',
          color: message.extra.color,
          callback(div) {
            document.getElementById("preview").onclick = function () {
              (this as HTMLButtonElement).disabled = true;

              message.session.oneway = true;
              root.rtcMultiConnection.sendMessage({
                renegotiate: true,
                streamid: message.streamid,
                session: message.session,
              });
            };

            document.getElementById("share-your-cam").onclick = function () {
              (this as HTMLButtonElement).disabled = true;

              if (!message.hasScreen) {
                const session = { audio: true, video: true };

                root.rtcMultiConnection.captureUserMedia(function (stream) {
                  root.rtcMultiConnection.renegotiatedSessions[JSON.stringify(session)] = {
                    session,
                    stream,
                  };

                  root.rtcMultiConnection.peers[message.userid].peer.connection.addStream(stream);
                  div.querySelector("#preview").onclick();
                }, session);
              }

              if (message.hasScreen) {
                const session = { screen: true };

                root.rtcMultiConnection.captureUserMedia(function (stream) {
                  root.rtcMultiConnection.renegotiatedSessions[JSON.stringify(session)] = {
                    session,
                    stream,
                  };

                  root.rtcMultiConnection.peers[message.userid].peer.connection.addStream(stream);
                  div.querySelector("#preview").onclick();
                }, session);
              }
            };
          },
        });
      }

      if (message.hasMic) {

        root.addNewMessage({
          header: message.extra.username,
          message: '<button id="listen"  class="myButtonChat" >Listen</button>' +
            '<button id="share-your-mic"  class="myButtonChat" >Share Your Mic</button>',
          userinfo: '<img src="imgs/share-files.png">',
          color: message.extra.color,
          callback(div) {
            div.querySelector("#listen").onclick = function () {
              this.disabled = true;
              message.session.oneway = true;
              root.rtcMultiConnection.sendMessage({
                renegotiate: true,
                streamid: message.streamid,
                session: message.session,
              });
            };

            div.querySelector("#share-your-mic").onclick = function () {

              this.disabled = true;
              const session = { audio: true };

              root.rtcMultiConnection.captureUserMedia(function (stream) {
                root.rtcMultiConnection.renegotiatedSessions[JSON.stringify(session)] = {
                  session,
                  stream,
                };

                root.rtcMultiConnection.peers[message.userid].peer.connection.addStream(stream);
                div.querySelector("#listen").onclick();
              }, session);

            };
          },
        });
      }

      if (message.renegotiate) {
        const customStream = root.rtcMultiConnection.customStreams[message.streamid];
        if (customStream) {
          root.rtcMultiConnection.peers[message.userid].renegotiate(customStream, message.session);
        }
      }

    };

    root.rtcMultiConnection.blobURLs = {};
    root.rtcMultiConnection.onstream = function (e) {
      if (e.stream.getVideoTracks().length) {
        root.rtcMultiConnection.blobURLs[e.userid] = e.blobURL;
        /*
        if( document.getElementById(e.userid) ) {
            document.getElementById(e.userid).muted = true;
            <video id="' + e.userid + '" src="' + URL.createObjectURL(e.stream) + '" autoplay muted=true volume=0></video>
        }
        */
        root.addNewMessage({
          header: e.extra.username,
          message: "Enabled webcam.",
          userinfo: "",
          color: e.extra.color,
        });
      } else {
        root.addNewMessage({
          header: e.extra.username,
          message: "Enabled microphone.",
          userinfo: '<audio src="' + URL.createObjectURL(e.stream) + '" controls muted=true volume=0></vide>',
          color: e.extra.color,
        });
      }

      // e.mediaElement.style.width = "50%";
      root.webCamView.appendChild(e.mediaElement);

    };

    root.rtcMultiConnection.sendMessage = function (message) {
      message.userid = root.rtcMultiConnection.userid;
      message.extra = root.rtcMultiConnection.extra;
      root.rtcMultiConnection.sendCustomMessage(message);
    };

    root.rtcMultiConnection.onclose = root.rtcMultiConnection.onleave = function (event) {

      root.addNewMessage({
        header: event.extra.username,
        message: "Left the game!",
        userinfo: root.getUserinfo(root.rtcMultiConnection.blobURLs[event.userid], '<img src="imgs/warning.png" >'),
        color: event.extra.color,
      });

      // DESTROY NETPLAYER - event.userid
      root.injector.leaveGamePlay(event);

    };

  }

  private attactLoggerUI() {
    const root = this;

    this.nameUI.onkeyup = (e) => {
      if (e.keyCode !== 13) { return; }
      root.connectUI.onclick(event as MouseEvent);
    };

    this.roomUI.onkeyup = function (e) {
      if (e.keyCode !== 13) { return; }
      (root.connectUI as any).onclick();
    };

    // this.roomUI.value

    if (localStorage.getItem("roomname")) {
      // this.roomUI.value = localStorage.getItem("roomname");
    }

    this.roomUI.onkeyup = function () {
      // localStorage.setItem("roomname", root.roomUI.value);
    };

    this.connectUI.onclick = function (ev) {

      if (!root.roomUI.value || root.roomUI.value.length === 0) {
        root.roomUI.focus();
        return alert("Enter secure channel code!");
      }

      (root.roomUI as any).onkeyup();

      root.nameUI.disabled = root.nameUI.disabled = (this as any).disabled = true;
      const username = root.nameUI.value || "Anonymous";

      root.rtcMultiConnection.extra = {
        username,
        color: getRandomColor(),
      };

      root.addNewMessage({
        header: username,
        message: "Searching for existing game...",
        userinfo: '<img class=".chatIcon" src="imgs/warning.png">',
      });

      const roomid = root.roomUI.value;
      root.rtcMultiConnection.channel = root.roomUI.value;

      const websocket = new WebSocket(root.engineConfig.getRemoteServerAddress());

      websocket.onmessage = function (event) {
        const data = JSON.parse(event.data);
        if (data.isChannelPresent === false) {
          root.addNewMessage({
            header: username,
            message: "Creating new host gamePlay id:" + root.roomUI.value,
            userinfo: "<img class='.chatIcon' src='imgs/warning.png'>",
          });

          root.rtcMultiConnection.open();
        } else {
          root.addNewMessage({
            header: username,
            message: "Game found. Joining the game...",
            userinfo: "",
          });
          root.rtcMultiConnection.join(root.roomUI.value);
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
          return root.rtcMultiConnection.send({
            stoppedTyping: true,
          });
        }

        root.rtcMultiConnection.send({
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
        header: root.rtcMultiConnection.extra.username,
        message: (window as any).linkify(root.senderUI.value),
        // userinfo: root.getUserinfo((rtcMultiConnection as any).blobURLs[(rtcMultiConnection as any).userid], "imgs/gcheckmark.png"),
        userinfo: "",
        color: root.rtcMultiConnection.extra.color,
      });

      console.log("test connection", root.rtcMultiConnection);
      root.rtcMultiConnection.send(root.senderUI.value);
      (byId("sender") as HTMLButtonElement).value = "";

    };

    getElement("#allow-webcam").onclick = (e) => {

      e.target.disabled = true;

      const session = { audio: true, video: true };
      root.rtcMultiConnection.captureUserMedia(function (stream) {
        const streamid = root.rtcMultiConnection.token();
        root.rtcMultiConnection.customStreams[streamid] = stream;

        root.rtcMultiConnection.sendMessage({
          hasCamera: true,
          streamid,
          session,
        });
      }, session);
    };

    getElement("#allow-mic").onclick = (e) => {

      e.target.disabled = true;

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
        root.rtcMultiConnection.send((this as HTMLInputElement).files[0]);
      };
      this.fireClickEvent(file);
    };

    this.fireClickEvent = (element) => {
      const evt = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
      } as any);

      element.dispatchEvent(evt);
    };

  }

  private addNewMessage(args) {

    const newMessageDIV = document.createElement("div");
    newMessageDIV.className = "new-message";
    const userinfoDIV = document.createElement("div");
    userinfoDIV.className = "user-info";
    userinfoDIV.innerHTML = args.userinfo; // || '<img class=".chatIcon" src="imgs/warning.png">';
    userinfoDIV.style.background = args.color || this.rtcMultiConnection.extra.color || getRandomColor();
    newMessageDIV.appendChild(userinfoDIV);

    const userActivityDIV = document.createElement("div");
    userActivityDIV.className = "myButtonChat";
    userActivityDIV.innerHTML = "<h5>" + args.header + "</h5>";

    const p = document.createElement("p");
    p.className = "textMessageNode";
    userActivityDIV.appendChild(p);
    p.innerHTML = args.message;
    newMessageDIV.appendChild(userActivityDIV);
    this.chatUI.insertBefore(newMessageDIV, this.chatUI.firstChild);

    this.chatUI.scrollTop = 0;

    if (args.callback) {
      args.callback(newMessageDIV);
    }

    // document.querySelector("#message-sound").play();
  }

}
export default Network;
