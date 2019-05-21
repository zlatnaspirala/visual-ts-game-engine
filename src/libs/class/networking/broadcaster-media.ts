import Broadcaster from "./broadcaster";
import * as RTCMultiConnection3 from "./rtc-multi-connection/RTCMultiConnection3";
require("./rtc-multi-connection/getHTMLMediaElement.js");

class BroadcasterMedia {

  private params;
  private rtcBroadcaster;

  constructor(broadcaster: Broadcaster, params) {

    this.params = {};
    const r = /([^&=]+)=?([^&]*)/g;
    function d(s) {
      return decodeURIComponent(s.replace(/\+/g, " "));
    }
    // tslint:disable-next-line:prefer-const
    let match, search = params; // (window as any).location.search;
    // tslint:disable-next-line:no-conditional-assignment
    while (match = r.exec(search.substring(1))) {
      this.params[d(match[1])] = d(match[2]);
    }
    (window as any).params = this.params;

    this.startVideoConference(broadcaster);
  }

  private startVideoConference(broadcaster) {

    const root = this;
    this.rtcBroadcaster = new (RTCMultiConnection3 as any)();
    // let connection = broadcaster.rtcmulticonnection;

    this.rtcBroadcaster.autoCloseEntireSession = true;
    this.rtcBroadcaster.publicRoomIdentifier = (window as any).params.publicRoomIdentifier;

    // console.log(" TEST connection.publicRoomIdentifier: ", this.rtcBroadcaster.publicRoomIdentifier);
    this.rtcBroadcaster.socketURL =
      broadcaster.engineConfig.getProtocolFromAddressBar() +
      broadcaster.engineConfig.getDomain() + ":" +
      broadcaster.engineConfig.getBroadcasterPort() + "/";

    this.rtcBroadcaster.socketMessageEvent = "video-conference-demo";

    this.rtcBroadcaster.session = {
      audio: true,
      video: true,
    };

    this.rtcBroadcaster.sdpConstraints.mandatory = {
      OfferToReceiveAudio: true,
      OfferToReceiveVideo: true,
    };

    this.rtcBroadcaster.videosContainer = document.getElementById("videos-container");
    this.rtcBroadcaster.onstream = function (event) {

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
        video.setAttribute("autoplay", "true");
        video.setAttribute("playsinline", "true");
      }

      if (event.type === "local") {
        video.volume = 0;
        try {
          video.setAttributeNode(document.createAttribute("muted"));
        } catch (e) {
          video.setAttribute("muted", "true");
        }
      }

      video.srcObject = event.stream;

      // const width = parseInt((root.rtcBroadcaster.videosContainer.clientWidth / 3) as any, 10) - 20;
      const width = 480;
      const height = 320;

      const mediaElement = (window as any).getHTMLMediaElement(video, {
        title: event.userid,
        buttons: ["full-screen"],
        width,
        height,
        showOnMouseEnter: false,
      });

      root.rtcBroadcaster.videosContainer.appendChild(mediaElement);

      setTimeout(function () {
        (mediaElement as any).media.play();
      }, 5000);

      mediaElement.id = event.streamid;

      if (event.type === "local") {
        root.rtcBroadcaster.socket.on("disconnect", function () {
          if (!root.rtcBroadcaster.getAllParticipants().length) {
            location.reload();
          }
        });
      }
    };

    this.rtcBroadcaster.onstreamended = function (event) {
      const mediaElement = document.getElementById(event.streamid);
      if (mediaElement) {
        mediaElement.parentNode.removeChild(mediaElement);
      }
    };

    this.rtcBroadcaster.onMediaError = function (e) {
      if (e.message === "Concurrent mic process limit.") {
        if (root.rtcBroadcaster.DetectRTC.audioInputDevices.length <= 1) {
          alert("Please select external microphone. Check github issue number 483.");
          return;
        }

        const secondaryMic = root.rtcBroadcaster.DetectRTC.audioInputDevices[1].deviceId;
        root.rtcBroadcaster.mediaConstraints.audio = {
          deviceId: secondaryMic,
        };

        root.rtcBroadcaster.join(root.rtcBroadcaster.sessionid);
      }
    };

    if (!!this.params.password) {
      this.rtcBroadcaster.password = this.params.password;
    }

    if (this.params.open === true || this.params.open === "true") {
      this.rtcBroadcaster.open(this.params.sessionid, function (isRoomOpened, roomid, error) {
        if (error) {
          if (error === root.rtcBroadcaster.errors.ROOM_NOT_AVAILABLE) {
            alert("Someone already created this room. Please either join or create a separate room.");
            return;
          }
          alert(error);
        }

        root.rtcBroadcaster.socket.on("disconnect", function () {
          location.reload();
        });
      });
    } else {
      root.rtcBroadcaster.join(this.params.sessionid, function (isRoomJoined, roomid, error) {
        if (error) {
          console.log(" check root.rtcBroadcaster.join ERROR");
          if (error === root.rtcBroadcaster.errors.ROOM_NOT_AVAILABLE) {
            alert("This room does not exist. Please either create it or wait for moderator to enter in the room.");
            return;
          }
          if (error === root.rtcBroadcaster.errors.ROOM_FULL) {
            alert("Room is full.");
            return;
          }
          if (error === root.rtcBroadcaster.errors.INVALID_PASSWORD) {
            root.rtcBroadcaster.password = prompt("Please enter room password.") || "";
            if (!root.rtcBroadcaster.password.length) {
              alert("Invalid password.");
              return;
            }
            root.rtcBroadcaster.join(root.params.sessionid, function (__, _, err) {
              if (err) {
                alert(err);
              }
              // console.log(isRoomJoined, roomid);
            });
            return;
          }
          alert(error);
        }

        root.rtcBroadcaster.socket.on("disconnect", function () {
          location.reload();
        });
      });
    }

    // detect 2G
    if ((navigator as any).connection &&
      (navigator as any).connection.type === "cellular" &&
      (navigator as any).connection.downlinkMax <= 0.115) {
      alert("2G is not supported. Please use a better internet service.");
    }

    console.log("loaded all");

  }

}
export default BroadcasterMedia;
