import Broadcaster from "./broadcaster";
import * as RTCMultiConnection3 from "./rtc-multi-connection/RTCMultiConnection3";

class BroadcasterMedia {

  private params;

  constructor(broadcaster: Broadcaster) {

    //(function () {
    const params = {},
      r = /([^&=]+)=?([^&]*)/g;

    function d(s) {
      return decodeURIComponent(s.replace(/\+/g, " "));
    }
    // tslint:disable-next-line:prefer-const
    let match, search = window.location.search;
    // tslint:disable-next-line:no-conditional-assignment
    while (match = r.exec(search.substring(1))) {
      params[d(match[1])] = d(match[2]);
    }
    (window as any).params = params;
    this.params = params;
    //})();

    this.startVideoConference(broadcaster);
  }

  private startVideoConference(broadcaster) {

    const connection = new RTCMultiConnection3();

    //let connection = broadcaster.rtcmulticonnection;
    connection.autoCloseEntireSession = true;
    connection.publicRoomIdentifier = (window as any).params.publicRoomIdentifier;

    // by default, socket.io server is assumed to be deployed on your own URL
    connection.socketURL = "http://localhost:9001/";

    // comment-out below line if you do not have your own socket.io server
    // connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';

    connection.socketMessageEvent = "video-conference-demo";

    connection.session = {
      audio: true,
      video: true,
    };

    connection.sdpConstraints.mandatory = {
      OfferToReceiveAudio: true,
      OfferToReceiveVideo: true,
    };

    connection.videosContainer = document.getElementById("videos-container");
    connection.onstream = function (event) {
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

      const width = parseInt(connection.videosContainer.clientWidth / 3) - 20;
      const mediaElement = getHTMLMediaElement(video, {
        title: event.userid,
        buttons: ["full-screen"],
        width,
        showOnMouseEnter: false,
      });

      connection.videosContainer.appendChild(mediaElement);

      setTimeout(function () {
        mediaElement.media.play();
      }, 5000);

      mediaElement.id = event.streamid;

      if (event.type === "local") {
        connection.socket.on("disconnect", function () {
          if (!connection.getAllParticipants().length) {
            location.reload();
          }
        });
      }
    };

    connection.onstreamended = function (event) {
      const mediaElement = document.getElementById(event.streamid);
      if (mediaElement) {
        mediaElement.parentNode.removeChild(mediaElement);
      }
    };

    connection.onMediaError = function (e) {
      if (e.message === "Concurrent mic process limit.") {
        if (DetectRTC.audioInputDevices.length <= 1) {
          alert("Please select external microphone. Check github issue number 483.");
          return;
        }

        const secondaryMic = DetectRTC.audioInputDevices[1].deviceId;
        connection.mediaConstraints.audio = {
          deviceId: secondaryMic,
        };

        connection.join(connection.sessionid);
      }
    };

    if (!!this.params.password) {
      connection.password = this.params.password;
    }

    if (this.params.open === true || this.params.open === "true") {
      connection.open(this.params.sessionid, function (isRoomOpened, roomid, error) {
        if (error) {
          if (error === connection.errors.ROOM_NOT_AVAILABLE) {
            alert("Someone already created this room. Please either join or create a separate room.");
            return;
          }
          alert(error);
        }

        connection.socket.on("disconnect", function () {
          location.reload();
        });
      });
    } else {
      connection.join(this.params.sessionid, function (isRoomJoined, roomid, error) {
        if (error) {
          if (error === connection.errors.ROOM_NOT_AVAILABLE) {
            alert("This room does not exist. Please either create it or wait for moderator to enter in the room.");
            return;
          }
          if (error === connection.errors.ROOM_FULL) {
            alert("Room is full.");
            return;
          }
          if (error === connection.errors.INVALID_PASSWORD) {
            connection.password = prompt("Please enter room password.") || "";
            if (!connection.password.length) {
              alert("Invalid password.");
              return;
            }
            connection.join(params.sessionid, function (isRoomJoined, roomid, error) {
              if (error) {
                alert(error);
              }
            });
            return;
          }
          alert(error);
        }

        connection.socket.on("disconnect", function () {
          location.reload();
        });
      });
    }

    // detect 2G
    if (navigator.connection &&
      navigator.connection.type === "cellular" &&
      navigator.connection.downlinkMax <= 0.115) {
      alert("2G is not supported. Please use a better internet service.");
    }

    console.log("loaded all")

  }

}
export default BroadcasterMedia;
