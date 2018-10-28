import { registerForm } from "../../../html-components/register.html";
import { IUserRegData } from "../../interface/global";
import { byId, validateEmail, validatePassword } from "../system";
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

    // window.WWW = this;
    this.showRegisterForm();

  }

  public showRegisterForm() {

    try {
      this.popupForm.innerHTML = registerForm;
      byId("login-button").addEventListener("click", this.registerUser, false);
      byId("forgotPassword").addEventListener("click", this.ForgotPassword, false);
    } catch (err) {
      console.warn("err in Controller.ShowRegisterForm :", err);
    }

  }

  public registerUser = (e) => {

    const localEmail: string = (byId("login-user") as HTMLInputElement).value;
    const localPassword: string = (byId("login-pass") as HTMLInputElement).value;

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

      let localMsg = { data: { action: "REGISTER", userRegData: userData } };
      this.sendObject(localMsg);
      localMsg = null;

    }

  }

  public ForgotPassword() {
    console.log("Forgot password !");
  }

  private onOpen = () => {

    console.warn("Session controller connected.");
    this.webSocketController.send(JSON.stringify({ data: "i am here" }));

  }

  private sendObject = (message) => {

    message = JSON.stringify(message);

    console.warn(message, "SEND!");

    if (!message) {
      console.error("no such channel exists");
      return;
    }

    try {
      this.webSocketController.send(message);
    } catch (e) {
      console.warn("Error", e);
    }
  }
  private onClose(evt) {
    console.warn("Session controller disconnected");
  }

  private onMessage(evt) {

    try {
      const dataReceive = JSON.parse(evt.data);
      console.warn("response : " + dataReceive);
    } catch (err) {
      console.error("Connector.onMessage : Error :", err);
    }

  }

  private onError(evt) {
    console.warn("onError" + evt.data);
  }

}
export default ConnectorClient;
