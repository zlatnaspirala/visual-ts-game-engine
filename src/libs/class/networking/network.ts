
import EngineConfig from "../../engine-config";
import { byId } from "../system";
// import { RTCMultiConnection } from "./rtc-multi-connection/RTCMultiConnection3";
import "./rtc-multi-connection/RTCMultiConnection2";

class Network {

  private type: string = "multiRtc";
  private rtcMultiConnection: any;
  private engineConfig: EngineConfig;

  private loggerDiv: HTMLDivElement;
  private webSocketData: WebSocket;
  private webSocketRTC: WebSocket;
  private webCamView: HTMLDivElement;

  private numbersOfUsers: number = 0;

  constructor(config: EngineConfig) {

    this.engineConfig = config;
    // window.RTCMultiConnection = RTCMultiConnection;
    this.rtcMultiConnection = new (window as any).RTCMultiConnection();
    this.rtcMultiConnection.session = { data: true };

    this.rtcMultiConnection.sdpConstraints.mandatory = {
      OfferToReceiveAudio: true,
      OfferToReceiveVideo: true,
    };

    byId("continue").addEventListener("click", this.LookForServer, false);
    byId("your-name").addEventListener("onkeyup", (this.logKeyChangedUserName as any), false);
    byId("room-name").addEventListener("onkeyup", (this.logKeyChangedRoom as any), false);
    this.loggerDiv = byId("logger") as HTMLDivElement;
    this.webCamView = byId("webCamView") as HTMLDivElement;

    this.Attacher();

  }

  public LookForServer = () => {

    const root = this;
    const debugDom: HTMLDivElement = byId("log-network") as HTMLDivElement;
    const yourName: HTMLInputElement = byId("your-name") as HTMLInputElement;
    const roomName: HTMLInputElement = byId("room-name") as HTMLInputElement;

    if (!roomName.value || !roomName.value.length) {
      roomName.focus();
      return alert("Your must enter main chanel!");
    }

    yourName.disabled = roomName.disabled = true;
    const username = yourName.value || "Anonymous";

    this.rtcMultiConnection.extra = {
      username,
      color: "lime",
    };


    const roomid = roomName.value;
    this.rtcMultiConnection.channel = roomid;

    this.addLog("Searching for existing rooms..." + roomid);

    this.webSocketData = new WebSocket(this.engineConfig.getRemoteServerAddress());
    this.webSocketData.onmessage = function (event) {
      const data = JSON.parse(event.data);
      if (data.isChannelPresent === false) {
        root.addLog("No room found. Creating new room");
        root.rtcMultiConnection.open();
      } else {
        root.addLog("Room found. Joining the room");
        root.rtcMultiConnection.join(roomid);
      }
    };
    this.webSocketData.onopen = function () {
      this.send(JSON.stringify({
        checkPresence: true,
        channel: roomid,
      }));
    };
  }

  public getUserinfo(blobURL, imageURL) {
    return blobURL ? '<video src="' + blobURL + '" autoplay controls></video>' : '<img src="' + imageURL + '">';
  }

  private logKeyChangedUserName(e: EventListenerOrEventListenerObject | React.KeyboardEvent) {
    if ((e as React.KeyboardEvent).keyCode !== 13) { return; }
    this.LookForServer();
  }

  private logKeyChangedRoom = (e: EventListenerOrEventListenerObject | React.KeyboardEvent) => {
    if ((e as React.KeyboardEvent).keyCode !== 13) { return; }
    this.LookForServer();
  }

  private addLog(msg: string) {
    this.loggerDiv.innerHTML += "<p>" + msg + "</p><br/>";
  }

  private Attacher() {

    const root = this;

    this.rtcMultiConnection.openSignalingChannel = (config) => {
      config.channel = config.channel || "programmers"; // this.channel;
      this.webSocketRTC = new WebSocket(this.engineConfig.getRemoteServerAddress());
      (this.webSocketRTC as any).channel = config.channel;
      this.webSocketRTC.onopen = () => {
        console.warn("WebSocket connection opened");
        (this.webSocketRTC as any).push(JSON.stringify({
          open: true,
          channel: config.channel,
        }));
        if (config.callback) {
          config.callback(this.webSocketRTC);
        }
      };
      this.webSocketRTC.onmessage = (event) => {
        config.onmessage(JSON.parse(event.data));
      };
      (this.webSocketRTC as any).push = this.webSocketRTC.send;
      this.webSocketRTC.send = (data) => {
        if (this.webSocketRTC.readyState !== 1) {
          return setTimeout(function () {
            root.webSocketRTC.send(data);
          }, 1000);
        }

        (this.webSocketRTC as any).push(JSON.stringify({
          data,
          channel: config.channel,
        }));
      };
    };
    this.rtcMultiConnection.customStreams = {};

    /*
    // http://www.rtcmulticonnection.org/docs/fakeDataChannels/
    rtcMultiConnection.fakeDataChannels = true;
    if(rtcMultiConnection.UA.Firefox) {
    rtcMultiConnection.session.data = true;
    }
    */

    this.rtcMultiConnection.autoTranslateText = false;

    this.rtcMultiConnection.onopen = (e) => {
      (byId("allow-webcam") as HTMLButtonElement).disabled = false;
      (byId("allow-mic") as HTMLButtonElement).disabled = false;
      (byId("share-files") as HTMLButtonElement).disabled = false;
      (byId("allow-screen") as HTMLButtonElement).disabled = false;

      /*
      addNewMessage({
        header: e.extra.username,
        message: 'Data connection is opened between you and ' + e.extra.username + '.',
        userinfo: getUserinfo(rtcMultiConnection.blobURLs[rtcMultiConnection.userid], 'images/info.png'),
        color: e.extra.color
      });
      */

      this.addLog("Data connection is opened between you and " + e.extra.username + ".");
      // this.numbersOfUsers.innerHTML = parseInt(numbersOfUsers.innerHTML) + 1;
      this.numbersOfUsers++;
    };

    // let whoIsTyping = document.querySelector("#who-is-typing");

    this.rtcMultiConnection.onmessage = (e) => {
      if (e.data.typing) {
        // whoIsTyping.innerHTML = e.extra.username + " is typing ...";
        document.head.title = e.extra.username + " is typing ...";
        return;
      }

      if (e.data.stoppedTyping) {
        // whoIsTyping.innerHTML = "";
        document.head.title = "";
        return;
      }

      // whoIsTyping.innerHTML = "";

      /*
      addNewMessage({
        header: e.extra.username,
        // tslint:disable-next-line:max-line-length
        message: "Text message from " + e.extra.username + ":<br /><br />" +
         (rtcMultiConnection.autoTranslateText ? linkify(e.data) + " ( " + linkify(e.original) + " )" : linkify(e.data)),
        userinfo: getUserinfo(rtcMultiConnection.blobURLs[e.userid], "images/chat-message.png"),
        color: e.extra.color
      });
      */

      this.addLog(e.extra.username + "" + e.extra.username);

      document.title = e.data;
    };

    const sessions = {};
    this.rtcMultiConnection.onNewSession = (session) => {
      if (sessions[session.sessionid]) { return; }
      sessions[session.sessionid] = session;
      session.join();
      /*
      addNewMessage({
        header: session.extra.username,
        message: "Making handshake with room owner....!",
        userinfo: '<img src="images/action-needed.png">',
        color: session.extra.color,
      });
      */
      this.addLog("Making handshake with room owner" + session.extra.username);
    };

    this.rtcMultiConnection.onRequest = (request) => {
      this.rtcMultiConnection.accept(request);
      /*
      addNewMessage({
        header: "New Participant",
        message: "A participant found. Accepting request of " + request.extra.username + " ( " + request.userid + " )...",
        userinfo: '<img src="images/action-needed.png">',
        color: request.extra.color,
      });
      */
      this.addLog("Accept user" + request.extra.username);
    };

    this.rtcMultiConnection.onCustomMessage = (message) => {
      if (message.hasCamera || message.hasScreen) {
        let msg = message.extra.username +
          ' enabled webcam. <button id="preview">Preview</button> ---- <button id="share-your-cam">Share Your Webcam</button>';

        if (message.hasScreen) {
          msg = message.extra.username +
            // tslint:disable-next-line:max-line-length
            'is ready to share screen. <button id="preview">View His Screen</button>-<button id="share-your-cam">Share Your Screen</button>';
        }

        /*
        addNewMessage({
          header: message.extra.username,
          message: msg,
          userinfo: '<img src="images/action-needed.png">',
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
                session = { audio: true, video: true };

                rtcMultiConnection.captureUserMedia(function (stream) {
                  rtcMultiConnection.renegotiatedSessions[JSON.stringify(session)] = {
                    session,
                    stream,
                  };

                  rtcMultiConnection.peers[message.userid].peer.connection.addStream(stream);
                  div.querySelector("#preview").onclick();
                }, session);
              }

              if (message.hasScreen) {
                const session = { screen: true };

                rtcMultiConnection.captureUserMedia(function (stream) {
                  rtcMultiConnection.renegotiatedSessions[JSON.stringify(session)] = {
                    session,
                    stream,
                  };

                  rtcMultiConnection.peers[message.userid].peer.connection.addStream(stream);
                  div.querySelector("#preview").onclick();
                }, session);
              }
            };
          },
        });
        */
      }

      if (message.hasMic) {
        /*
        addNewMessage({
          header: message.extra.username,
          message: message.extra.username +
           ' enabled microphone. <button id="listen">Listen</button> ---- <button id="share-your-mic">Share Your Mic</button>',
          userinfo: '<img src="images/action-needed.png">',
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
        */
      }

      if (message.renegotiate) {
        const customStream = root.rtcMultiConnection.customStreams[message.streamid];
        if (customStream) {
          root.rtcMultiConnection.peers[message.userid].renegotiate(customStream, message.session);
        }
      }
    };

    this.rtcMultiConnection.blobURLs = {};
    this.rtcMultiConnection.onstream = function (e) {
      if (e.stream.getVideoTracks().length) {
        root.rtcMultiConnection.blobURLs[e.userid] = e.blobURL;
        /* NON ACTIVE - Nikola lukic
        if( document.getElementById(e.userid) ) {
            document.getElementById(e.userid).muted = true;
        }
        */

        /*
        addNewMessage({
          header: e.extra.username,
          message: e.extra.username + " enabled webcam.",
          userinfo: '<video id="' + e.userid + '" src="' + URL.createObjectURL(e.stream) + '" autoplay muted=true volume=0></vide>',
          color: e.extra.color,
        });

        */

      } else {

        /*
        addNewMessage({
          header: e.extra.username,
          message: e.extra.username + " enabled microphone.",
          userinfo: '<audio src="' + URL.createObjectURL(e.stream) + '" controls muted=true volume=0></vide>',
          color: e.extra.color,
        });
        */
      }
      this.webCamView.appendChild(e.mediaElement);
    };

    this.rtcMultiConnection.sendMessage = (message) => {
      message.userid = this.rtcMultiConnection.userid;
      message.extra = this.rtcMultiConnection.extra;
      this.rtcMultiConnection.sendCustomMessage(message);
    };

    this.rtcMultiConnection.onclose = this.rtcMultiConnection.onleave = function (event) {
      /*
      addNewMessage({
        header: event.extra.username,
        message: event.extra.username + " left the room.",
        userinfo: getUserinfo(rtcMultiConnection.blobURLs[event.userid], "images/info.png"),
        color: event.extra.color,
      });
      */
    };

  }

}
export default Network;
