
require("../../../externals/jquery.slim.min");
const $ = require("jquery");
import "popper.js";
import "../../../externals/bootstrap.min";
import { byId, bytesToSize, getElement, getRandomColor, htmlHeader } from "../system";
import "./rtc-multi-connection/linkify";
import  * as RTCMultiConnection3 from "./rtc-multi-connection/RTCMultiConnection3";
import * as io from "./rtc-multi-connection/socket.io";
import { getHTMLMediaElement } from "./rtc-multi-connection/getHTMLMediaElement"

class Broadcaster {

  private connection: any;
  private engineConfig: any;
  private popupUI: HTMLDivElement = null;
  private webCamView: HTMLDivElement;
  private txtRoomId: HTMLElement;
  private publicRoomIdentifier: string;
  private connector;
  private chatContainer = document.querySelector('.chat-output');

  private showBroadcastOnInit: boolean = true;

  constructor(config: any) {

    (window as any).io = io;

    const root = this;
    this.engineConfig = config;
    if (this.showBroadcastOnInit) {
      this.showBroadcaster();
    }

  }

  public closeAllPeers(): void {
    this.connection.close();
  }

  private initWebRtc = () => {
    let root = this;
    // ......................................................
    // ..................RTCMultiConnection Code.............
    // ......................................................

    console.log("what is rtc", RTCMultiConnection3)
    this.connection = new RTCMultiConnection3();

    // by default, socket.io server is assumed to be deployed on your own URL
    this.connection.socketURL = 'http://localhost:9001/';

    // comment-out below line if you do not have your own socket.io server
    // connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';

    this.connection.socketMessageEvent = 'audio-video-file-chat-demo';

    this.connection.enableFileSharing = true; // by default, it is "false".

    this.connection.session = {
        audio: true,
        video: true,
        data: true
    };

    this.connection.sdpConstraints.mandatory = {
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: true
    };

    // https://www.rtcmulticonnection.org/docs/iceServers/
    // use your own TURN-server here!
    this.connection.iceServers = [{
        'urls': [
            'stun:stun.l.google.com:19302',
            'stun:stun1.l.google.com:19302',
            'stun:stun2.l.google.com:19302',
            'stun:stun.l.google.com:19302?transport=udp',
        ]
    }];

    this.connection.videosContainer = document.getElementById('videos-container');
    this.connection.onstream = function(event) {
        event.mediaElement.removeAttribute('src');
        event.mediaElement.removeAttribute('srcObject');

        var video = document.createElement('video');
        video.controls = true;
        if(event.type === 'local') {
            video.muted = true;
        }
        video.srcObject = event.stream;

        var width: number = parseInt(root.connection.videosContainer.clientWidth / 2) - 20;
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
        (document.getElementById('share-file') as HTMLInputElement).disabled = false;
        (document.getElementById('input-text-chat') as HTMLInputElement).disabled = false;
        (document.getElementById('btn-leave-room') as HTMLInputElement).disabled = false;

        document.querySelector('h1').innerHTML = 'You are connected with: ' +
          root.connection.getAllParticipants().join(', ');
    };

    this.connection.onclose = function() {
        if (this.connection.getAllParticipants().length) {
            document.querySelector('h1').innerHTML = 'You are still connected with: ' +
              this.connection.getAllParticipants().join(', ');
        } else {
            document.querySelector('h1').innerHTML = 'Seems session has been closed or all participants left.';
        }
    };

    this.connection.onEntireSessionClosed = function(event) {
        (document.getElementById('share-file') as HTMLInputElement).disabled = true;
        (document.getElementById('input-text-chat') as HTMLInputElement).disabled = true;
        (document.getElementById('btn-leave-room') as HTMLInputElement).disabled = true;

        (document.getElementById('open-or-join-room') as HTMLInputElement).disabled = false;
        (document.getElementById('open-room') as HTMLInputElement).disabled = false;
        (document.getElementById('join-room') as HTMLInputElement).disabled = false;
        (document.getElementById('room-id') as HTMLInputElement).disabled = false;

        this.connection.attachStreams.forEach(function(stream) {
            stream.stop();
        });

        // don't display alert for moderator
        if (this.connection.userid === event.userid) return;
        document.querySelector('h1').innerHTML = 'Entire session has been closed by the moderator: ' + event.userid;
    };

    this.connection.onUserIdAlreadyTaken = function(useridAlreadyTaken, yourNewUserId) {
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
        (document.getElementById('open-or-join-room') as HTMLInputElement).disabled = true;
        (document.getElementById('open-room') as HTMLInputElement).disabled = true;
        (document.getElementById('join-room') as HTMLInputElement).disabled = true;
        (document.getElementById('room-id') as HTMLInputElement).disabled = true;
  }

  private appendDIV(event) {
        var div = document.createElement('div');
        div.innerHTML = event.data || event;
        this.chatContainer.insertBefore(div, this.chatContainer.firstChild);
        div.tabIndex = 0;
        div.focus();
        document.getElementById('input-text-chat').focus();
  }

  private alertBox(message, title, specialMessage?, callback?) {
    callback = callback || function () { /**/ };

    $(".btn-alert-close").unbind("click").bind("click", function (e) {
      e.preventDefault();
      $("#alert-box").modal("hide");
      $("#confirm-box-topper").hide();

      // backdrop $('#modal-backdrop').hide();
      callback();
    });

    $("#alert-title").html(title || "Alert");
    $("#alert-special").html(specialMessage || "");
    $("#alert-message").html(message);
    $("#confirm-box-topper").show();

    $("#alert-box").modal({
      backdrop: "static",
      keyboard: false,
    });
  }

  private postAttach () {

    let root = this;
    var roomid = '';
    if (localStorage.getItem(root.connection.socketMessageEvent)) {
      roomid = localStorage.getItem(root.connection.socketMessageEvent);
    } else {
      roomid = root.connection.token();
    }
    (document.getElementById('room-id') as HTMLInputElement).value = roomid;
    (document.getElementById('room-id') as HTMLInputElement).onkeyup = function() {
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
      (document.getElementById('room-id') as HTMLInputElement).value = roomid;
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
    // .......................UI Code........................
    document.getElementById('open-room').onclick = function() {
        root.disableInputButtons();
        root.connection.open((document.getElementById('room-id') as HTMLInputElement).value, function() {
            root.showRoomURL(root.connection.sessionid);
        });
    };

    document.getElementById('join-room').onclick = function() {
        root.disableInputButtons();
        root.connection.join((document.getElementById('room-id') as HTMLInputElement).value);
    };

    document.getElementById('open-or-join-room').onclick = function() {
        root.disableInputButtons();
        root.connection.openOrJoin((document.getElementById('room-id') as HTMLInputElement).value,
          function(isRoomExists, roomid) {
            if (!isRoomExists) {
              root.showRoomURL(roomid);
            }
          });
    };

    (document.getElementById('btn-leave-room') as HTMLButtonElement).onclick = function() {
        (this as HTMLButtonElement).disabled = true;

        if (root.connection.isInitiator) {
            // use this method if you did NOT set "autoCloseEntireSession===true"
            // for more info: https://github.com/muaz-khan/RTCMultiConnection#closeentiresession
            root.connection.closeEntireSession(function() {
                document.querySelector('h1').innerHTML = 'Entire session has been closed.';
            });
        } else {
            root.connection.leave();
        }
    };

    // ......................................................
    // ................FileSharing/TextChat Code.............
    // ......................................................

    document.getElementById('share-file').onclick = function() {
        var fileSelector = new (window as any).FileSelector();
        fileSelector.selectSingleFile(function(file) {
            root.connection.send(file);
        });
    };

    (document.getElementById('input-text-chat') as HTMLInputElement).onkeyup = function(e) {
        if (e.keyCode != 13) return;

        // removing trailing/leading whitespace
        (this as HTMLInputElement).value = (this as HTMLInputElement).value.replace(/^\s+|\s+$/g, '');
        if (!(this as HTMLInputElement).value.length) return;

        root.connection.send((this as HTMLInputElement).value);
        root.appendDIV((this as HTMLInputElement).value);
        (this as HTMLInputElement).value = '';
    };

    // ......................................................
    // ......................Handling Room-ID................
    // ......................................................
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

  private showBroadcaster = () => {

    const myInstance = this;
    fetch("./templates/broadcaster.html", {
      headers: htmlHeader,
    }).
      then(function (res) {
        return res.text();
      }).then(function (html) {
        // console.warn(html);
        myInstance.popupUI = byId("popup") as HTMLDivElement;
        myInstance.popupUI.innerHTML = html;
        myInstance.popupUI.style.display = "block";
        // byId("reg-button").addEventListener("click", myInstance.registerUser, false);
        myInstance.attachEvents();
        myInstance.initWebRtc();

      });

  }

}
export default Broadcaster;
