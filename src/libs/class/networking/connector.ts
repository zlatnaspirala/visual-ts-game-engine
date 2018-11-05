
import { IMessageReceived, IUserRegData } from "../../interface/global";
import { UniClick } from "../../types/global";
import { byId, htmlHeader, validateEmail, validatePassword } from "../system";
import EngineConfig from "./../../client-config";

class ConnectorClient {

  private webSocketController;
  private popupForm: HTMLDivElement;

  constructor(config: EngineConfig) {

    this.popupForm = byId("popup") as HTMLDivElement;

    this.webSocketController = new WebSocket(config.getRemoteServerAddressControlller());
    this.webSocketController.onopen = this.onOpen;
    this.webSocketController.onclose = this.onClose;
    this.webSocketController.onmessage = this.onMessage;
    this.webSocketController.onerror = this.onError;

    this.showRegisterForm();

  }

  private showRegisterForm = () => {

    const myInstance = this;
    fetch("./templates/register.html", {
      headers: htmlHeader,
    }).
      then(function (res) {
        return res.text();
      }).then(function (html) {
        // console.warn(html);
        myInstance.popupForm.innerHTML = html;
        byId("reg-button").addEventListener("click", myInstance.registerUser, false);
        byId("sing-in-tab").addEventListener("click", myInstance.showLoginForm, false);
      });

  }

  private showLoginForm = () => {

    const myInstance = this;
    fetch("./templates/login.html", {
      headers: htmlHeader,
    }).
      then(function (res) {
        return res.text();
      }).then(function (html) {
        // console.warn(html);
        myInstance.popupForm.innerHTML = html;
        byId("login-button").addEventListener("click", myInstance.registerUser, false);
        byId("forgotPassword").addEventListener("click", myInstance.ForgotPassword, false);
        byId("sing-up-tab").addEventListener("click", myInstance.showRegisterForm, false);
      });
  }

  private registerUser = (e: UniClick) => {

    e.preventDefault();

    const localEmail: string = (byId("reg-user") as HTMLInputElement).value;
    const localPassword: string = (byId("reg-pass") as HTMLInputElement).value;

    if (validateEmail(localEmail) !== null) {
      byId("error-msg-reg").style.display = "block";
      byId("error-msg-reg").innerText = validateEmail(localEmail);
    }

    if (validatePassword(localPassword) === false) {
      byId("error-msg-reg").style.display = "block";
      byId("error-msg-reg").innerText += "Password is not valid! length!";
    }

    if (validateEmail(localEmail) === null && validatePassword(localPassword) === true) {

      const userData: IUserRegData = {
        email: localEmail,
        password: localPassword,
      };

      let localMsg = { action: "REGISTER", data: { userRegData: userData } };
      this.sendObject(localMsg);
      localMsg = null;

    }

  }

  private ForgotPassword() {
    console.log("Forgot password !");
  }

  private onOpen = () => {

    console.warn("Session controller connected.");
    this.webSocketController.send(JSON.stringify({ data: "i am here" }));

  }

  private sendObject = (message) => {

    try {
      message = JSON.stringify(message);
    } catch (err) {
      console.error("Connector.sendObject : ", err);
      return;
    }
    console.warn(message, "<SEND>");

    try {
      this.webSocketController.send(message);
    } catch (e) {
      console.warn("Connector.sendObject (2) : ", e);
    }
  }

  private onClose(evt) {
    console.warn("Session controller disconnected");
  }

  private onMessage = (evt) => {

    try {
      const dataReceive: IMessageReceived = JSON.parse(evt.data);
      switch (dataReceive.action) {
        case "CHECK_EMAIL":
          {
            this.onMsgCheckEmail();
          }
        case "ERROR_EMAIL":
          {
            byId("error-msg-reg").innerHTML = dataReceive.data.errMsg;
          }
        default:
          console.log("Connector : Not handled case for dataReceive : ", dataReceive.action);
      }
      console.log("response : " + dataReceive);
    } catch (err) {
      console.error("Connector.onMessage : Error :", err);
    }

  }

  private onError(evt) {
    console.warn("onError" + evt.data);
  }

  private onMsgCheckEmail = () => {

    byId("reg-button").removeEventListener("click", this.registerUser);
    byId("reg-button").addEventListener("click", this.verifyRegistration, false);
    byId("reg-button").innerHTML = "VERIFY CODE";
    byId("reg-pass-label").innerHTML = "Paste Verification code here";
    (byId("reg-pass") as HTMLInputElement).innerHTML = "";
    (byId("reg-pass") as HTMLInputElement).placeholder = "Paste Verification code here";

  }

  private verifyRegistration = (event: UniClick) => {

    event.preventDefault();

    let localPasswordToken: string = (byId("reg-pass") as HTMLInputElement).value;
    let localEmail: string = (byId("reg-user") as HTMLInputElement).value;
    let localMsg = { action: "REG_VALIDATE", data: { email: localEmail, userRegToken: localPasswordToken } };
    this.sendObject(localMsg);
    localMsg = null;
    localPasswordToken = null;
    localEmail = null;
  }

  private userAccountCreated() {
    // test
  }

}
export default ConnectorClient;
