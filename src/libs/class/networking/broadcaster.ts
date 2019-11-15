
require("../../../externals/jquery.slim.min");
const $ = require("jquery");
import "popper.js";
import "../../../externals/bootstrap.min";

import { byId, bytesToSize, getElement, getRandomColor, htmlHeader } from "../system";
import BroadcasterMedia from "./broadcaster-media";
import "./rtc-multi-connection/linkify";
import * as RTCMultiConnection3 from "./rtc-multi-connection/RTCMultiConnection3";
import * as io from "./rtc-multi-connection/socket.io";

class Broadcaster {

  private connection: any;
  private engineConfig: any;
  private popupUI: HTMLDivElement = null;
  private webCamView: HTMLDivElement;
  private txtRoomId: HTMLElement;
  private publicRoomIdentifier: string;
  private connector;

  private showBroadcastOnInit: boolean = false;

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
    const root = this;

    root.connection = new RTCMultiConnection();

    // by default, socket.io server is assumed to be deployed on your own URL
    root.connection.socketURL = "/";

    // comment-out below line if you do not have your own socket.io server
    // connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';

    root.connection.socketMessageEvent = "video-conference-demo";

    root.connection.session = {
      audio: true,
      video: true
    };

    root.connection.sdpConstraints.mandatory = {
      OfferToReceiveAudio: true,
      OfferToReceiveVideo: true
    };

    // STAR_FIX_VIDEO_AUTO_PAUSE_ISSUES
    // via: https://github.com/muaz-khan/RTCMultiConnection/issues/778#issuecomment-524853468
    let bitrates = 512;
    let resolutions = "Ultra-HD";
    let videoConstraints = {};

    if (resolutions == "HD") {
      videoConstraints = {
        width: {
          ideal: 1280
        },
        height: {
          ideal: 720
        },
        frameRate: 30
      };
    }

    if (resolutions == "Ultra-HD") {
      videoConstraints = {
        width: {
          ideal: 1920
        },
        height: {
          ideal: 1080
        },
        frameRate: 30
      };
    }

    root.connection.mediaConstraints = {
      video: videoConstraints,
      audio: true
    };

    let CodecsHandler = root.connection.CodecsHandler;

    root.connection.processSdp = function (sdp) {
      const codecs = "vp8";

      if (codecs.length) {
        sdp = CodecsHandler.preferCodec(sdp, codecs.toLowerCase());
      }

      if (resolutions == "HD") {
        sdp = CodecsHandler.setApplicationSpecificBandwidth(sdp, {
          audio: 128,
          video: bitrates,
          screen: bitrates
        });

        sdp = CodecsHandler.setVideoBitrates(sdp, {
          min: bitrates * 8 * 1024,
          max: bitrates * 8 * 1024,
        });
      }

      if (resolutions == "Ultra-HD") {
        sdp = CodecsHandler.setApplicationSpecificBandwidth(sdp, {
          audio: 128,
          video: bitrates,
          screen: bitrates
        });

        sdp = CodecsHandler.setVideoBitrates(sdp, {
          min: bitrates * 8 * 1024,
          max: bitrates * 8 * 1024,
        });
      }

      return sdp;
    };
    // END_FIX_VIDEO_AUTO_PAUSE_ISSUES

    // https://www.rtcmulticonnection.org/docs/iceServers/
    // use your own TURN-server here!
    root.connection.iceServers = [{
      urls: [
        "stun:stun.l.google.com:19302",
        "stun:stun1.l.google.com:19302",
        "stun:stun2.l.google.com:19302",
        "stun:stun.l.google.com:19302?transport=udp",
      ],
    }];

    root.connection.videosContainer = document.getElementById("videos-container");
    root.connection.onstream = function (event) {
      const existing = document.getElementById(event.streamid);
      if (existing && existing.parentNode) {
        existing.parentNode.removeChild(existing);
      }

      event.mediaElement.removeAttribute("src");
      event.mediaElement.removeAttribute("srcObject");
      event.mediaElement.muted = true;
      event.mediaElement.volume = 0;

      const video = document.createElement("video");

      try {
        video.setAttributeNode(document.createAttribute("autoplay"));
        video.setAttributeNode(document.createAttribute("playsinline"));
      } catch (e) {
        video.setAttribute("autoplay", true);
        video.setAttribute("playsinline", true);
      }

      if (event.type === "local") {
        video.volume = 0;
        try {
          video.setAttributeNode(document.createAttribute("muted"));
        } catch (e) {
          video.setAttribute("muted", true);
        }
      }
      video.srcObject = event.stream;

      const width = parseInt(root.connection.videosContainer.clientWidth / 3) - 20;
      const mediaElement = getHTMLMediaElement(video, {
        title: event.userid,
        buttons: ["full-screen"],
        width: width,
        showOnMouseEnter: false
      });

      root.connection.videosContainer.appendChild(mediaElement);

      setTimeout(function () {
        mediaElement.media.play();
      }, 5000);

      mediaElement.id = event.streamid;

      // to keep room-id in cache
      localStorage.setItem(root.connection.socketMessageEvent, root.connection.sessionid);

      chkRecordConference.parentNode.style.display = "none";

      if (chkRecordConference.checked === true) {
        btnStopRecording.style.display = "inline-block";
        recordingStatus.style.display = "inline-block";

        let recorder = root.connection.recorder;
        if (!recorder) {
          recorder = RecordRTC([event.stream], {
            type: "video"
          });
          recorder.startRecording();
          root.connection.recorder = recorder;
        }
        else {
          recorder.getInternalRecorder().addStreams([event.stream]);
        }

        if (!root.connection.recorder.streams) {
          root.connection.recorder.streams = [];
        }

        root.connection.recorder.streams.push(event.stream);
        recordingStatus.innerHTML = "Recording " + root.connection.recorder.streams.length + " streams";
      }

      if (event.type === "local") {
        root.connection.socket.on("disconnect", function () {
          if (!root.connection.getAllParticipants().length) {
            location.reload();
          }
        });
      }
    };

    let recordingStatus = document.getElementById("recording-status");
    let chkRecordConference = document.getElementById("record-entire-conference");
    let btnStopRecording = document.getElementById("btn-stop-recording");

    btnStopRecording.onclick = function () {
      let recorder = connection.recorder;
      if (!recorder) return alert("No recorder found.");
      recorder.stopRecording(function () {
        const blob = recorder.getBlob();
        invokeSaveAsDialog(blob);

        root.connection.recorder = null;
        btnStopRecording.style.display = "none";
        recordingStatus.style.display = "none";
        chkRecordConference.parentNode.style.display = "inline-block";
      });
    };

    root.connection.onstreamended = function (event) {
      const mediaElement = document.getElementById(event.streamid);
      if (mediaElement) {
        mediaElement.parentNode.removeChild(mediaElement);
      }
    };

    root.connection.onMediaError = function (e) {
      if (e.message === "Concurrent mic process limit.") {
        if (DetectRTC.audioInputDevices.length <= 1) {
          alert("Please select external microphone. Check github issue number 483.");
          return;
        }

        const secondaryMic = DetectRTC.audioInputDevices[1].deviceId;
        root.connection.mediaConstraints.audio = {
          deviceId: secondaryMic
        };

        root.connection.join(root.connection.sessionid);
      }
    };

  }

  private looper = () => {}

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

  private attachEvents() {

    const root = this;

    document.getElementById("open-room").onclick = function () {
      root.disableInputButtons();
      root.connection.open(document.getElementById("room-id").value, function (isRoomOpened, roomid, error) {
        if (isRoomOpened === true) {
          root.showRoomURL(root.connection.sessionid);
        }
        else {
          root.disableInputButtons(true);
          if (error === "Room not available") {
            alert("Someone already created this room. Please either join or create a separate room.");
            return;
          }
          alert(error);
        }
      });
    };

    document.getElementById("join-room").onclick = function () {
      root.disableInputButtons();
      root.connection.join((document.getElementById("room-id") as HTMLInputElement).value, function (isJoinedRoom, roomid, error) {
        if (error) {
          root.disableInputButtons(true);
          if (error === "Room not available") {
            alert("This room does not exist. Please either create it or wait for moderator to enter in the room.");
            return;
          }
          alert(error);
        }
      });
    };

    document.getElementById("open-or-join-room").onclick = function () {
      root.disableInputButtons();
      root.connection.openOrJoin((document.getElementById("room-id") as HTMLInputElement).value, function (isRoomExist, roomid, error) {
        if (error) {
          root.disableInputButtons(true);
          alert(error);
        }
        else if (root.connection.isInitiator === true) {
          // if room doesn't exist, it means that current user will create the room
          root.showRoomURL(roomid);
        }
      });
    };

  }

  private confirmBox(message, callback) {
    $("#btn-confirm-action").html("Confirm").unbind("click").bind("click", function (e) {
      e.preventDefault();
      $("#confirm-box").modal("hide");
      $("#confirm-box-topper").hide();
      callback(true);
    });

    $("#btn-confirm-close").html("Cancel");

    $(".btn-confirm-close").unbind("click").bind("click", function (e) {
      e.preventDefault();
      $("#confirm-box").modal("hide");
      $("#confirm-box-topper").hide();
      callback(false);
    });

    $("#confirm-message").html(message);
    $("#confirm-title").html("Please Confirm");
    $("#confirm-box-topper").show();

    $("#confirm-box").modal({
      backdrop: "static",
      keyboard: false,
    });
  }

  private showRoomURL(roomid) {
    const roomHashURL = "#" + roomid;
    const roomQueryStringURL = "?roomid=" + roomid;

    let html = "<h2>Unique URL for your room:</h2><br>";

    html += 'Hash URL: <a href="' + roomHashURL + '" target="_blank">' + roomHashURL + "</a>";
    html += "<br>";
    html += 'QueryString URL: <a href="' + roomQueryStringURL + '" target="_blank">' + roomQueryStringURL + "</a>";

    const roomURLsDiv = document.getElementById("room-urls");
    roomURLsDiv.innerHTML = html;

    roomURLsDiv.style.display = "block";
}


  private openInNewWindow = () => {
    //
  }

  private disableInputButtons(enable: boolean | undefined) {
    (document.getElementById("room-id") as HTMLInputElement).onkeyup();
    if (typeof enable === "undefined") { return; }
    (document.getElementById("open-or-join-room") as HTMLInputElement).disabled = !enable;
    (document.getElementById("open-room") as HTMLInputElement).disabled = !enable;
    (document.getElementById("join-room") as HTMLInputElement).disabled = !enable;
    (document.getElementById("room-id") as HTMLInputElement).disabled = !enable;
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
