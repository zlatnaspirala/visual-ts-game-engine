
import EngineConfig from "../../engine-config";
import { byId, getElement, getRandomColor } from "../system";
import "./rtc-multi-connection/linkify";
import "./rtc-multi-connection/RTCMultiConnection2";
// import "./test/ui.share-files";

class Network {

  private rtcMultiConnection: any;
  private engineConfig: EngineConfig;
  private loggerUI: HTMLDivElement;
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

  constructor(config: EngineConfig) {

    this.engineConfig = config;
    this.loggerUI = byId("log-network") as HTMLDivElement;
    this.webCamView = byId("webCamView") as HTMLDivElement;
    this.senderUI = byId("sender") as HTMLTextAreaElement;
    this.nameUI = this.loggerUI.querySelector("#your-name");
    this.roomUI = this.loggerUI.querySelector("#room-name");
    this.connectUI = this.loggerUI.querySelector("#continue");
    this.whoIsTyping = this.loggerUI.querySelector("#who-is-typing");
    this.chatUI = this.loggerUI.querySelector("#log-chat");

    if (this.engineConfig.getNetworkDeepLog() === false) {
      (window as any).log = function () {/* empty */ };
    }

    this.roomUI.value = this.engineConfig.getMasterServerKey();
    this.roomUI.style.display = "none";
    this.attactLoggerUI();

    (window as any).rtcMultiConnection = new (window as any).RTCMultiConnection();
    this.rtcMultiConnection = rtcMultiConnection;
    this.rtcMultiConnection.session = { data: true };
    this.rtcMultiConnection.sdpConstraints.mandatory = {
      OfferToReceiveAudio: true,
      OfferToReceiveVideo: true,
    };

    this.attachWebRtc();

  }

  private attachWebRtc() {

    const root = this;

    this.rtcMultiConnection.openSignalingChannel = function (config) {

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
          return setTimeout(function () {
            this.send(data);
          }, 1000);
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
        let msg = message.extra.username +
          'enabled webcam. <button id="preview" class="myButton" >Preview</button>' +
          + '<button class="myButton" id="share-your-cam">Share webcam</button>';

        if (message.hasScreen) {
          msg = message.extra.username +
            'Ready to share screen <button id="preview"  class="myButton">remote screen</button>' +
            '<button id="share-your-cam"  class="myButton">Share screen</button>';
        }

        root.addNewMessage({
          header: message.extra.username,
          message: msg,
          userinfo: '<img src="imgs/share-files.png">',
          color: message.extra.color,
          callback(div) {
            div.querySelector("#preview").onclick = function () {
              this.disabled = true;

              message.session.oneway = true;
              root.rtcMultiConnection.sendMessage({
                renegotiate: true,
                streamid: message.streamid,
                session: message.session,
              });
            };

            div.querySelector("#share-your-cam").onclick = function () {
              this.disabled = true;

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
          message: '<button id="listen"  class="myButton" >Listen</button>' +
            '<button id="share-your-mic"  class="myButton" >Share Your Mic</button>',
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

      e.mediaElement.style.width = "50%";
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
        message: "Left the room.",
        userinfo: root.getUserinfo(root.rtcMultiConnection.blobURLs[event.userid], "<img src'./imgs/warning.png' >"),
        color: event.extra.color,
      });
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

    // this.roomUI.value = ;

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

      (rtcMultiConnection as any).extra = {
        username,
        color: getRandomColor(),
      };

      root.addNewMessage({
        header: username,
        message: "Searching for existing rooms...",
        userinfo: '<img class=".chatIcon" src="imgs/warning.png">',
      });

      const roomid = root.roomUI.value;
      (rtcMultiConnection as any).channel = root.roomUI.value;

      const websocket = new WebSocket(root.engineConfig.getRemoteServerAddress());

      websocket.onmessage = function (event) {
        const data = JSON.parse(event.data);
        if (data.isChannelPresent === false) {
          root.addNewMessage({
            header: username,
            message: "No room.Creating new room" + root.roomUI.value,
            userinfo: "<img class='.chatIcon' src='imgs/warning.png'>",
          });

          (rtcMultiConnection as any).open();
        } else {
          root.addNewMessage({
            header: username,
            message: "Room found. Joining the room...",
            userinfo: "",
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
        header: (rtcMultiConnection as any).extra.username,
        message: (window as any).linkify(root.senderUI.value),
        // userinfo: root.getUserinfo((rtcMultiConnection as any).blobURLs[(rtcMultiConnection as any).userid], "imgs/gcheckmark.png"),
        userinfo: "",
        color: (rtcMultiConnection as any).extra.color,
      });

      (rtcMultiConnection as any).send(root.senderUI.value);
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
    userActivityDIV.className = "myButton";
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
