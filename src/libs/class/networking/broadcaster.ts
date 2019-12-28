
import "./rtc-multi-connection/FileBufferReader.js";
import { byId, htmlHeader } from "../system";
import { getHTMLMediaElement } from "./rtc-multi-connection/getHTMLMediaElement";
import * as RTCMultiConnection3 from "./rtc-multi-connection/RTCMultiConnection3";
import * as io from "./rtc-multi-connection/socket.io";
import ClientConfig from "../../../client-config.js";

class Broadcaster {

  private connection: any;
  private engineConfig: ClientConfig;
  // Internal config flag
  private showBroadcasterOnInt: boolean = true;

  private popupUI: HTMLDivElement = null;
  private broadcasterUI: HTMLElement;
  private titleStatus: HTMLElement;
  private openRoomBtn: HTMLElement;
  private joinRoomBtn: HTMLElement;
  private openOrJoinBtn: HTMLElement;
  private leaveRoomBtn: HTMLElement;
  private shareFileBtn: HTMLElement;
  private inputChat: HTMLElement;
  private inputRoomId: HTMLElement;

  constructor(config: any) {

    (window as any).io = io;

    this.engineConfig = config;
    if (this.engineConfig.getRunBroadcasterOnInt()) {
      require("../../../icon/permission/share-files.png");
      this.runBroadcaster();
    }

  }

  public closeAllPeers(): void {
    this.connection.close();
  }

  private initDOM() {
    this.broadcasterUI = byId('media-rtc3-controls');
    this.titleStatus = byId('rtc3log');
    this.openRoomBtn = byId('open-room');
    this.joinRoomBtn = byId('join-room');
    this.openOrJoinBtn = byId('open-or-join-room');
    this.leaveRoomBtn = byId('btn-leave-room');
    this.shareFileBtn = byId('share-file');
    this.inputChat = byId('input-text-chat');
    this.inputRoomId = byId('room-id');
  }

  private initWebRtc = (options?) => {
    let root = this;

    this.connection = new (RTCMultiConnection3 as any)();
    this.connection.socketURL = root.engineConfig.getBroadcastSockRoute();

    this.connection.socketMessageEvent = 'audio-video-file-chat-demo';

    if (typeof options !== 'undefined') {
      // by default, it is "false".
      this.connection.enableFileSharing = options.enableFileSharing;

      this.connection.session = {
        audio: options.session.audio,
        video: options.session.video,
        data: options.session.data
      };

    } else {

    this.connection.enableFileSharing = root.engineConfig.getBroadcasterSessionDefaults().enableFileSharing;

      this.connection.session = {
        audio: root.engineConfig.getBroadcasterSessionDefaults().sessionAudio,
        video: root.engineConfig.getBroadcasterSessionDefaults().sessionVideo,
        data: root.engineConfig.getBroadcasterSessionDefaults().sessionData
      };

    }


    this.connection.sdpConstraints.mandatory = {
      OfferToReceiveAudio: true,
      OfferToReceiveVideo: true
    };

    this.connection.iceServers = [{
      urls: root.engineConfig.getStunList()
    }];

    this.connection.videosContainer = document.getElementById('videos-container');
    this.connection.onstream = function(event) {
      event.mediaElement.removeAttribute("src");
      event.mediaElement.removeAttribute("srcObject");

      var video = document.createElement('video');
      video.controls = true;
      if(event.type === 'local') {
          video.muted = true;
      }
      video.srcObject = event.stream;

      var localNumberCW = root.connection.videosContainer.clientWidth / 2;
      var width: number = parseInt(localNumberCW.toString()) - 20;

      var mediaElement = getHTMLMediaElement(video, {
          title: event.userid,
          buttons: ['full-screen'],
          width: width,
          showOnMouseEnter: false
      });

      root.connection.videosContainer.appendChild(mediaElement);

      setTimeout(function() {
          (mediaElement as any).media.play();
      }, 5000);

      mediaElement.id = event.streamid;
    };

    this.connection.onstreamended = function(event) {
      var mediaElement = document.getElementById(event.streamid);
      if (mediaElement) {
          mediaElement.parentNode.removeChild(mediaElement);
      }
    };

    this.connection.onmessage = root.appendDIV;
    this.connection.filesContainer = document.getElementById('file-container');

    this.connection.onopen = function() {

      (root.shareFileBtn as HTMLInputElement).disabled = false;
      (root.inputChat as HTMLInputElement).disabled = false;
      (root.leaveRoomBtn as HTMLInputElement).disabled = false;

      document.querySelector('#rtc3log').innerHTML = 'You are connected with: ' +
        root.connection.getAllParticipants().join(', ');
    };

    this.connection.onclose = function() {
      if (root.connection.getAllParticipants().length) {
        (document.querySelector('#rtc3log') as HTMLInputElement).value = 'You are still connected with:' +
          root.connection.getAllParticipants().join(', ');
      } else {
        (document.querySelector('#rtc3log') as HTMLInputElement).value = 'Seems session has been closed or all participants left.';
      }
    };

    this.connection.onEntireSessionClosed = function(event) {

      (root.shareFileBtn as HTMLInputElement).disabled = true;
      (root.inputChat as HTMLInputElement).disabled = true;
      (root.leaveRoomBtn as HTMLInputElement).disabled = true;
      (root.openOrJoinBtn as HTMLInputElement).disabled = false;
      (root.openRoomBtn as HTMLInputElement).disabled = false;
      (root.inputRoomId as HTMLInputElement).disabled = false;
      (root.inputRoomId as HTMLInputElement).disabled = false;

      root.connection.attachStreams.forEach(function(stream) {
          stream.stop();
      });

      // don't display alert for moderator
      if (root.connection.userid === event.userid) return;
      document.querySelector('#rtc3log').innerHTML = 'Entire session has been closed by the moderator: ' + event.userid;
    };

    this.connection.onUserIdAlreadyTaken = function(useridAlreadyTaken) {
      // seems room is already opened
      root.connection.join(useridAlreadyTaken);
    };

    this.postAttach()

  }

  private showRoomURL(roomid) {
      var roomHashURL = '#' + roomid;
      var roomQueryStringURL = '?roomid=' + roomid;

      var html = '<h2>Unique URL for your room:</h2><br>';

      html += 'Hash URL: <a href="' + roomHashURL + '" target="_blank">' + roomHashURL + '</a>';
      html += '<br>';
      html += 'QueryString URL: <a href="' + roomQueryStringURL + '" target="_blank">' + roomQueryStringURL + '</a>';

      var roomURLsDiv = document.getElementById('room-urls');
      roomURLsDiv.innerHTML = html;

      roomURLsDiv.style.display = 'block';
  }

  private disableInputButtons = function() {
    (this.openOrJoinBtn as HTMLInputElement).disabled = true;
    (this.openRoomBtn as HTMLInputElement).disabled = true;
    (this.inputRoomId as HTMLInputElement).disabled = true;
    (this.inputRoomId as HTMLInputElement).disabled = true;
    (this.leaveRoomBtn as HTMLInputElement).disabled = false;
  }

  private appendDIV = (event) => {
    var div = document.createElement('div');
    div.innerHTML = event.data || event;
    let chatContainer = document.querySelector('.chat-output');
    chatContainer.insertBefore(div, chatContainer.firstChild);
    div.tabIndex = 0;
    div.focus();
    document.getElementById('input-text-chat').focus();
  }

  private postAttach () {

    let root = this;
    var roomid = '';
    if (localStorage.getItem(root.connection.socketMessageEvent)) {
      roomid = localStorage.getItem(root.connection.socketMessageEvent);
    } else {
      roomid = root.connection.token();
    }

    if (root.engineConfig.getMasterServerKey()) {
      roomid = root.engineConfig.getMasterServerKey();
    }

    (root.inputRoomId as HTMLInputElement).value = roomid;
    (root.inputRoomId as HTMLInputElement).onkeyup = function() {
      localStorage.setItem(root.connection.socketMessageEvent, (this as HTMLInputElement).value);
    };

    var hashString = location.hash.replace('#', '');
    if (hashString.length && hashString.indexOf('comment-') == 0) {
      hashString = '';
    }

    var roomid: string = (window as any).params.roomid;
    if (!roomid && hashString.length) {
        roomid = hashString;
    }

    if (roomid && roomid.length) {
      (root.inputRoomId as HTMLInputElement).value = roomid;
      localStorage.setItem(root.connection.socketMessageEvent, roomid);

      // auto-join-room
      (function reCheckRoomPresence() {
        root.connection.checkPresence(roomid, function(isRoomExists) {
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

    const root = this;
    (window as any).enableAdapter = true;
    // UI Code

    // hide right box (broadcaster)
    // root.broadcasterUI
    root.titleStatus.onclick = function() {
      if (root.broadcasterUI.classList.contains('network-panel-show-ver-animation')) {
      root.broadcasterUI.classList.remove('network-panel-show-ver-animation')
      root.broadcasterUI.classList.add('network-panel-hide-ver-animation')
      } else {
      root.broadcasterUI.classList.add('network-panel-show-ver-animation')
      root.broadcasterUI.classList.remove('network-panel-ver-hide-animation')
      }
    }

    root.openRoomBtn.onclick = function() {
        root.disableInputButtons();
        root.connection.open((root.inputRoomId as HTMLInputElement).value, function() {
            root.showRoomURL(root.connection.sessionid);
        });
    };

    root.joinRoomBtn.onclick = function() {
        root.disableInputButtons();
        root.connection.join((root.inputRoomId as HTMLInputElement).value);
    };

    root.openOrJoinBtn.onclick = function() {
        root.disableInputButtons();
        root.connection.openOrJoin((root.inputRoomId as HTMLInputElement).value,
          function(isRoomExists, roomid) {
            if (!isRoomExists) {
              root.showRoomURL(roomid);
            }
          });
    };

    (root.leaveRoomBtn as HTMLButtonElement).onclick = function() {
        (this as HTMLButtonElement).disabled = true;

        if (root.connection.isInitiator) {
            // use this method if you did NOT set "autoCloseEntireSession===true"
            // for more info: https://github.com/muaz-khan/RTCMultiConnection#closeentiresession
            root.connection.closeEntireSession(function() {
                document.querySelector('#rtc3log').innerHTML = 'Entire session has been closed.';
            });
        } else {
            root.connection.leave();
        }
    };

    // ................FileSharing/TextChat Code.............
    root.shareFileBtn.onclick = function() {
       console.log("test >>> SHARE ")
        var fileSelector = new (window as any).FileSelector();
        fileSelector.selectSingleFile(function(file) {
            console.log("test , ", file)
            root.connection.send(file);
        });
    };

    (root.inputChat as HTMLInputElement).onkeyup = function(e) {
        if (e.keyCode != 13) return;

        // removing trailing/leading whitespace
        (this as HTMLInputElement).value = (this as HTMLInputElement).value.replace(/^\s+|\s+$/g, '');
        if (!(this as HTMLInputElement).value.length) return;

        root.connection.send((this as HTMLInputElement).value);
        root.appendDIV((this as HTMLInputElement).value);
        (this as HTMLInputElement).value = '';
    };

    // Handling Room-ID
    (function() {
        var params = {},
          r = /([^&=]+)=?([^&]*)/g;

        function d(s) {
          return decodeURIComponent(s.replace(/\+/g, ' '));
        }
        var match, search = window.location.search;
        while (match = r.exec(search.substring(1)))
          params[d(match[1])] = d(match[2]);
        (window as any).params = params;
    })();

  }

  private runBroadcaster = () => {

    const myInstance = this;
    fetch("./templates/broadcaster.html", {
      headers: htmlHeader,
    }).
      then(function (res) {
        return res.text();
      }).then(function (html) {
        // console.warn(html);
        myInstance.popupUI = byId("media-rtc3-controls") as HTMLDivElement;
        myInstance.popupUI.innerHTML = html;

        if (myInstance.showBroadcasterOnInt) {
          myInstance.popupUI.style.display = "block"
        } else {
          myInstance.popupUI.style.display = "none"
        }

        myInstance.initDOM();
        myInstance.attachEvents();
        myInstance.initWebRtc();

        if (myInstance.engineConfig.getBroadcastAutoConnect()) {

          myInstance.inputRoomId.nodeValue = myInstance.engineConfig.getMasterServerKey();
          myInstance.openOrJoinBtn.click();
        }

      });

  }

}
export default Broadcaster;
