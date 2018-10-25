const serverConfig = require("../../server-config");
const fs = require("fs");
const express = require("express");

class Connector {

  constructor() {

    this.config = serverConfig;
    this.socket = null;

    if (this.config.connector.protocol === "http") {
      this.http = require("http");
    } else {
      this.http = require("https");
    }
    this.app = express();

    this.server = this.http.createServer(this.app);
    this.io = require("socket.io").listen(this.server);
    this.server.listen(this.config.connector.port);
    console.warn("Socket server listening on port: ", this.config.connector.port);

    this.attach();

  }

  attach() {

    this.io.sockets.on("connection", function(socket) {

      this.socket = socket;

      console.warn("-------------------------------------------------------------");
      console.warn("CONNECTED WITH GAME SERVER Visual ts game engine version 1.0");
      console.warn("-------------------------------------------------------------");
      console.warn("Attaching events...");

      socket.on("register", this.userRegister);
      socket.on("activateAccount", this.activateAccount);
      socket.on("login", this.userLogin);
      socket.on("newpass", this.userNewPass);
      socket.on("disconnect", this.userDisconnect);

      console.warn("Attached events : register, activateAccount, login, newpass, disconnect");

    });

  }

  userRegister(userInput) {
    // test
    // socket.emit('realtime', "registerDoneMailVerification", "Your email is not valid");
  }

  activateAccount(code) {

    console.warn("activateAccount event : ", code);

  }

  userLogin(userInput) {

    console.warn("userLogin event : ", userInput);

  }

  userNewPass(userInput) {
    console.warn("userNewPass event : ", userInput);
  }

  userDisconnect() {
    console.warn("userDisconnect event : ");
    // io.sockets.emit('updateusers', usernames);
    // echo globally that this client has left
    this.socket.broadcast.emit("realtime", "SERVER", this.socket.username + " has disconnected");
  }

}
module.exports = Connector;
