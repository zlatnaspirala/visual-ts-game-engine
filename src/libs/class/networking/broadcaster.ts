
require("../../../externals/jquery.slim.min");
const $ = require("jquery");
import "popper.js";
// require("../../../externals/popper.min");
import "../../../externals/bootstrap.min";

import { byId, bytesToSize, getElement, getRandomColor, htmlHeader } from "../system";
import BroadcasterMedia from "./broadcaster-media";
import "./rtc-multi-connection/linkify";
import * as RTCMultiConnection3 from "./rtc-multi-connection/RTCMultiConnection3";
import * as io from "./rtc-multi-connection/socket.io";

class Broadcaster {

  private rtcMultiConnection: any;
  private engineConfig: any;
  private popupUI: HTMLDivElement = null;
  private webCamView: HTMLDivElement;
  private txtRoomId: HTMLElement;
  private publicRoomIdentifier: string;
  private connector;

  constructor(config: any) {

    (window as any).io = io;

    const root = this;
    this.engineConfig = config;
    // this.webCamView = byId("webCamView") as HTMLDivElement;
    this.showBroadcaster();

  }

  public closeAllPeers(): void {
    this.rtcMultiConnection.close();
  }

  private initWebRtc = () => {
    const root = this;
    // this object is used to get uniquie rooms based on this demo
    // i.e. only those rooms that are created on this page
    this.publicRoomIdentifier = "video-conference-dashboard";
    this.rtcMultiConnection = new (RTCMultiConnection3 as any)();
    this.rtcMultiConnection.socketURL =
      location.protocol + "//" +
      root.engineConfig.getDomain() + ":" +
      root.engineConfig.getBroadcasterPort() + "/";
    /// make this room public
    this.rtcMultiConnection.publicRoomIdentifier = this.publicRoomIdentifier;
    this.rtcMultiConnection.socketMessageEvent = this.publicRoomIdentifier;
    // keep room opened even if owner leaves
    this.rtcMultiConnection.autoCloseEntireSession = true;

    this.rtcMultiConnection.connectSocket(function (socket) {

      root.looper();
      socket.on("disconnect", function () {
        location.reload();
      });

    });
  }

  private looper = () => {
    const root = this;
    if (!$("#rooms-list").length) { return; }

    this.rtcMultiConnection.socket.emit("get-public-rooms", this.publicRoomIdentifier, function (listOfRooms) {
      root.updateListOfRooms(listOfRooms);
      setTimeout(root.looper, 3000);
    });
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

  private updateListOfRooms = (rooms) => {
    $("#active-rooms").html(rooms.length);

    $("#rooms-list").html("");

    if (!rooms.length) {
      $("#rooms-list").html("<tr><td colspan=9>No active room found for this demo.</td></tr>");
      return;
    }

    rooms.forEach(function (room, idx) {
      const tr = document.createElement("tr");
      let html = "";
      if (!room.isPasswordProtected) {
        html += "<td>" + (idx + 1) + "</td>";
      } else {
        html += "<td>" +
          (idx + 1) +
          // tslint:disable-next-line:max-line-length
          '<img src="https://webrtcweb.com/password-protected.png" style="height: 15px; vertical-align: middle;" title="Password Protected Room"></td>';
      }

      html += '<td><span class="max-width" title="' + room.sessionid + '">' + room.sessionid + "</span></td>";
      html += '<td><span class="max-width" title="' + room.owner + '">' + room.owner + "</span></td>";

      html += "<td>";
      Object.keys(room.session || {}).forEach(function (key) {
        html += "<pre><b>" + key + ":</b> " + room.session[key] + "</pre>";
      });
      html += "</td>";

      html += '<td><span class="max-width" title="' +
        JSON.stringify(room.extra || {}).replace(/"/g, "`") + '">' + JSON.stringify(room.extra || {}) + "</span></td>";

      html += "<td>";
      room.participants.forEach(function (pid) {
        html += '<span class="userinfo"><span class="max-width" title="' + pid + '">' + pid + "</span></span><br>";
      });
      html += "</td>";

      // check if room is full
      if (room.isRoomFull) {
        // room.participants.length >= room.maxParticipantsAllowed
        html += '<td><span style="border-bottom: 1px dotted red; color: red;">Room is full</span></td>';
      } else {
        html += '<td><button class="btn join-room" data-roomid="' +
          room.sessionid + '" data-password-protected="' + (room.isPasswordProtected === true ? "true" : "false") + '">Join</button></td>';
      }
      $(tr).html(html);
      $("#rooms-list").append(tr);

      $(tr).find(".join-room").click(function () {
        $(tr).find(".join-room").prop("disabled", true);

        const roomid = $(this).attr("data-roomid");
        $("#txt-roomid-hidden").val(roomid);

        $("#btn-show-join-hidden-room").click();

        if ($(this).attr("data-password-protected") === "true") {
          $("#txt-room-password-hidden").parent().show();
        } else {
          $("#txt-room-password-hidden").parent().hide();
        }

        $(tr).find(".join-room").prop("disabled", false);
      });
    });
  }

  private attachEvents() {

    const root = this;

    $("#btn-show-join-hidden-room").click(function (e) {
      e.preventDefault();
      $("#txt-room-password-hidden").parent().hide();
      $("#joinRoomModel").modal("show");
    });

    $("#btn-join-hidden-room").click(function () {
      const roomid = $("#txt-roomid-hidden").val().toString();
      if (!roomid || !roomid.replace(/ /g, "").length) {
        root.alertBox("Please enter room-id.", "Room ID Is Required");
        return;
      }

      const fullName = $("#txt-user-name-hidden").val().toString();
      if (!fullName || !fullName.replace(/ /g, "").length) {
        root.alertBox("Please enter your name.", "Your Name Is Required");
        return;
      }

      root.rtcMultiConnection.extra.userFullName = fullName;

      if ($("#txt-room-password-hidden").parent().css("display") !== "none") {
        const roomPassword = $("#txt-room-password-hidden").val().toString();
        if (!roomPassword || !roomPassword.replace(/ /g, "").length) {
          root.alertBox("Please enter room password.", "Password Box Is Empty");
          return;
        }
        root.rtcMultiConnection.password = roomPassword;

        root.rtcMultiConnection.socket.emit("is-valid-password",
          root.rtcMultiConnection.password, roomid, function (isValidPassword, roomid, error) {
            if (isValidPassword === true) {
              root.joinAHiddenRoom(roomid);
            } else {
              root.alertBox(error, "Password Issue");
            }
          });
        return;
      }

      root.joinAHiddenRoom(roomid);
    });

    $("#btn-create-room").click(function () {
      console.log(" ??????? ");
      const roomid = $("#txt-roomid").val().toString();
      if (!roomid || !roomid.replace(/ /g, "").length) {
        root.alertBox("Please enter room-id.", "Room ID Is Required");
        return;
      }

      const fullName = $("#txt-user-name").val().toString();
      if (!fullName || !fullName.replace(/ /g, "").length) {
        root.alertBox("Please enter your name.", "Your Name Is Required");
        return;
      }

      root.rtcMultiConnection.extra.userFullName = fullName;

      if ($("#chk-room-password").prop("checked") === true) {
        const roomPassword = $("#txt-room-password").val().toString();
        if (!roomPassword || !roomPassword.replace(/ /g, "").length) {
          root.alertBox("Please enter room password.", "Password Box Is Empty");
          return;
        }

        root.rtcMultiConnection.password = roomPassword;
      }

      const initialHTML = $("#btn-create-room").html();

      $("#btn-create-room").html("Please wait...").prop("disabled", true);

      root.rtcMultiConnection.checkPresence(roomid, function (isRoomExist) {
        if (isRoomExist === true) {
          root.alertBox("This room-id is already taken and room is active. Please join instead.", "Room ID In Use");
          return;
        }

        if ($("#chk-hidden-room").prop("checked") === true) {
          // either make it unique!
          // connection.publicRoomIdentifier = connection.token() + connection.token();

          // or set an empty value (recommended)
          root.rtcMultiConnection.publicRoomIdentifier = "";
        }

        root.rtcMultiConnection.sessionid = roomid;
        root.rtcMultiConnection.isInitiator = true;
        root.openInNewWindow();

        $("#btn-create-room").html(initialHTML).prop("disabled", false);
      });
    });

    $("#chk-room-password").change(function () {
      $("#txt-room-password").parent().css("display", this.checked === true ? "block" : "none");
      $("#txt-room-password").focus();
    });

    this.txtRoomId = document.getElementById("txt-roomid");

    this.txtRoomId.onkeyup = this.txtRoomId.onblur = this.txtRoomId.oninput = this.txtRoomId.onpaste = function () {
      localStorage.setItem("canvas-designer-roomid", (root.txtRoomId as HTMLInputElement).value);
    } as any;

    if (localStorage.getItem("canvas-designer-roomid")) {
      (this.txtRoomId as HTMLInputElement).value = localStorage.getItem("canvas-designer-roomid");
      $("#txt-roomid-hidden").val((this.txtRoomId as HTMLInputElement).value);
    }

    const userFullName = document.getElementById("txt-user-name");

    userFullName.onkeyup = userFullName.onblur = userFullName.oninput = userFullName.onpaste = function () {
      localStorage.setItem("canvas-designer-user-full-name", (userFullName as HTMLInputElement).value);
    } as any;

    if (localStorage.getItem("canvas-designer-user-full-name")) {
      (userFullName as HTMLInputElement).value = localStorage.getItem("canvas-designer-user-full-name");
      $("#txt-user-name-hidden").val((userFullName as HTMLInputElement).value);
    }

  }

  private joinAHiddenRoom(roomid) {
    const root = this;
    const initialHTML = $("#btn-join-hidden-room").html();

    $("#btn-join-hidden-room").html("Please wait...").prop("disabled", true);

    root.rtcMultiConnection.checkPresence(roomid, function (isRoomExist) {
      if (isRoomExist === false) {
        root.alertBox("No such room exist on this server. Room-id: " + roomid, "Room Not Found");
        $("#btn-join-hidden-room").html(initialHTML).prop("disabled", false);
        return;
      }

      root.rtcMultiConnection.sessionid = roomid;
      root.rtcMultiConnection.isInitiator = false;
      $("#joinRoomModel").modal("hide");
      root.openInNewWindow();

      $("#btn-join-hidden-room").html(initialHTML).prop("disabled", false);
    });
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

  private openInNewWindow = () => {

    const root = this;
    let href_: any;

    $("#startRoomModel").modal("hide");
    // let href
    let params = /*location.href*/ "?open=" +
      root.rtcMultiConnection.isInitiator + "&sessionid=" + root.rtcMultiConnection.sessionid +
      "&publicRoomIdentifier=" + root.rtcMultiConnection.publicRoomIdentifier +
      "&userFullName=" + root.rtcMultiConnection.extra.userFullName;

    if (!!root.rtcMultiConnection.password) {
      href_ += "&password=" + root.rtcMultiConnection.password;
    }

    let broadcasterMedia = new BroadcasterMedia(root, params);

    /*
    const newWin = window.open(href_);
    if (!newWin || newWin.closed || typeof newWin.closed === "undefined") {
      let html = "";
      html += "<p>Please click following link:</p>";
      html += '<p><a href="' + href_ + '" target="_blank">';
      if (root.rtcMultiConnection.isInitiator) {
        html += "Click To Open The Room";
      } else {
        html += "Click To Join The Room";
      }
      html += "</a></p>";
      root.alertBox(html, "Popups Are Blocked");
    }
    */
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
