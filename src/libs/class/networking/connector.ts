
import EngineConfig from "../../../client-config";
import { DEFAULT_PLAYER_DATA } from "../../defaults";
import { IMessageReceived, IUserRegData } from "../../interface/global";
import { NetMsg, UniClick } from "../../types/global";
import { byId, createAppEvent, encodeString, htmlHeader, validateEmail, validatePassword } from "../system";
import Memo from "./../local-storage";

class ConnectorClient {

  protected popupForm: HTMLDivElement;
  protected hideUserProfileBtn: HTMLDivElement;
  private webSocketController;
  private memo: Memo;
  private gamesList: any[];

  constructor(config: EngineConfig) {

    this.memo = new Memo();
    this.memo.save("online", false);

    this.gamesList = config.getGamesList();
    /**
     * Popup element is main root for all classic html tags HUD view elements
     */
    this.popupForm = byId("popup") as HTMLDivElement;

    this.webSocketController = new WebSocket(config.getRemoteServerAddressControlller());
    this.webSocketController.onopen = this.onOpen;
    this.webSocketController.onclose = this.onClose;
    this.webSocketController.onmessage = this.onMessage;
    this.webSocketController.onerror = this.onError;

    console.info("Test 121212");

    if (config.getStartUpHtmlForm() === "register") {
      this.showRegisterForm();
    } else if (config.getStartUpHtmlForm() === "login") {
      this.showLoginForm(null);
    }

  }

  public showRegisterForm = () => {

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

  private showLoginForm = (data) => {

    const myInstance = this;
    fetch("./templates/login.html", {
      headers: htmlHeader,
    }).
      then(function (res) {
        return res.text();
      }).then(function (html) {
        myInstance.popupForm.innerHTML = html;
        byId("login-button").addEventListener("click", myInstance.loginUser, false);
        byId("sing-up-tab").addEventListener("click", myInstance.showRegisterForm, false);
        if (data && data.data && data.data.test) {
          byId("error-msg-login").innerHTML = data.data.text;
        }
      }).catch(function (err) {
        console.warn("Error in showLoginForm : ", err);
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
      byId("error-msg-reg").innerText = "Password is not valid! length!";
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

  private loginUser = (e: UniClick) => {

    e.preventDefault();

    const localEmail: string = (byId("login-user") as HTMLInputElement).value;
    const localPassword: string = (byId("login-pass") as HTMLInputElement).value;

    if (validateEmail(localEmail) !== null) {
      byId("error-msg-login").style.display = "block";
      byId("error-msg-login").innerText = validateEmail(localEmail);
    }

    if (validatePassword(localPassword) === false) {
      byId("error-msg-login").style.display = "block";
      byId("error-msg-login").innerText += "Password is not valid! length!";
    }

    if (validateEmail(localEmail) === null && validatePassword(localPassword) === true) {

      const userData: IUserRegData = {
        email: localEmail,
        password: localPassword,
      };

      let localMsg = { action: "LOGIN", data: { userLoginData: userData } };
      this.sendObject(localMsg);
      localMsg = null;

    }

  }

  private fastLogin = () => {

    const userData: any = {
      email: this.memo.load("localUserData"),
      token: this.memo.load("token"),
    };

    if (userData.email === false || userData.token === false) {
      return;
    }

    let localMsg = { action: "FLOGIN", data: { userLoginData: userData } };
    this.sendObject(localMsg);
    localMsg = null;

  }

  private ForgotPassword() {
    console.log("Forgot password !");
  }

  private onOpen = () => {
    console.info("Session controller connected.");
    this.webSocketController.send(JSON.stringify({ data: "i am here" }));

    this.fastLogin();

  }

  private sendObject = (message: IMessageReceived | string) => {

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

    console.warn("Session controller disconnected!", evt);

  }

  private onMessage = (evt) => {

    try {
      const dataReceive: IMessageReceived = JSON.parse(evt.data);
      console.log("Connector : dataReceive raw : ", evt.data);
      switch (dataReceive.action) {
        case "CHECK_EMAIL": {
            this.onMsgCheckEmail(dataReceive);
            break;
          }
        case "VERIFY_SUCCESS": {
            this.showLoginForm(dataReceive);
            break;
          }
        case "ONLINE": {
            this.memo.save("online", "true");
            this.memo.save("accessToken", dataReceive.data.accessToken);
            if (dataReceive.data.userData) {
              this.memo.save("nickname", dataReceive.data.userData.nickname);
            } else {
              this.memo.save("nickname", dataReceive.data.user.nickname);
            }

            this.showUserAccountProfilePage(dataReceive);
            break;
          }
        case "GET_USER_DATA": {
            this.showUserAccountProfilePage(dataReceive);
            break;
          }
        case "NICKNAME_UPDATED": {
            this.showNewNickname(dataReceive);
            break;
          }
        case "ERROR_EMAIL": {
            (byId("notify") as HTMLInputElement).innerHTML = dataReceive.data.errMsg;
            break;
          }
        case "GAMEPLAY_STARTED": {

          // Means reConnect
          if (this.memo.load("activeGame") === "none") {
            console.log("PREVENT ONLY JOIN - test only");
            // return;
          }

          this.memo.save("activeGame", dataReceive.data.userData.activeGame);
          document.title = dataReceive.data.userData.activeGame;

          // local data
          const appUpdateLivesGamePlay = createAppEvent("update-lives",
            {
              lives: DEFAULT_PLAYER_DATA.INITIAL_LIVES.toString(),
            });

          (window as any).dispatchEvent(appUpdateLivesGamePlay);

          if ((byId("UIPlayerLives") as HTMLSpanElement) !== null) {
            (byId("UIPlayerLives") as HTMLSpanElement).innerText = DEFAULT_PLAYER_DATA.INITIAL_LIVES.toString();
          }
          (byId("your-name") as HTMLInputElement).value = this.memo.load("nickname");
          if ((byId("out-of-game") as HTMLButtonElement) !== null) {
            (byId("out-of-game") as HTMLButtonElement).disabled = false;
          }
          (byId("continue") as HTMLButtonElement).disabled = false;
          (byId("continue") as HTMLButtonElement).click();
          console.log(" (byId continue as HTMLButtonElement).click(); ");
          break;
        }
        case "LOG_OUT": {
          // destroy game play if exist
          location.reload(true);
          break;
        }
        case "OUT_OF_GAME": {
          // destroy gamePlay
          console.log("OUT_OF_GAME");
          (byId("continue") as HTMLButtonElement).disabled = false;
          (byId("out-of-game") as HTMLButtonElement).disabled = true;
          this.outOfGame(this.memo.load("activeGame"));
          break;
        }
        default:
          console.log("Connector : dataReceive action : ", dataReceive.action);
      }
    } catch (err) {
      console.error("Connector.onMessage : Error :", err);
    }

  }

  private onError(evt) {
    console.warn("onError" + evt.data);
  }

  private onMsgCheckEmail = (dataReceive) => {

    byId("reg-button").removeEventListener("click", this.registerUser);
    byId("reg-button").addEventListener("click", this.verifyRegistration, false);
    byId("reg-button").innerHTML = "VERIFY CODE";
    byId("reg-pass-label").innerHTML = "Paste Verification code here";
    (byId("reg-pass") as HTMLInputElement).value = "";
    (byId("reg-pass") as HTMLInputElement).placeholder = "Paste Verification code here";
    console.log("TEST", dataReceive.data);
    (byId("notify") as HTMLInputElement).innerHTML = dataReceive.data.text;

    this.memo.save("accessToken", dataReceive.data.accessToken);
  }

  private verifyRegistration = (event: UniClick) => {

    event.preventDefault();
    const accessToken = this.memo.load("accessToken");
    let localPasswordToken: string = (byId("reg-pass") as HTMLInputElement).value;
    let localEmail: string = (byId("reg-user") as HTMLInputElement).value;
    let localMsg = {
      action: "REG_VALIDATE",
      data: {
        email: localEmail,
        userRegToken: localPasswordToken,
        accessToken,
      },
    };
    this.sendObject(localMsg);
    localMsg = null;
    localPasswordToken = null;
    localEmail = null;
  }

  private showUserAccountProfilePage = (dataReceive) => {

    const myInstance = this;
    fetch("./templates/user-profile.html", {
      headers: htmlHeader,
    }).
      then(function (res) {
        return res.text();
      }).then(function (html) {

        myInstance.popupForm.innerHTML = html;

        if (!byId("user-profile-btn-ok")) {
          myInstance.hideUserProfileBtn = document.createElement("div");
          myInstance.hideUserProfileBtn.id = "user-profile-btn-ok";
          myInstance.hideUserProfileBtn.classList.add("login-button");
          myInstance.hideUserProfileBtn.innerText = "User profile";
          document.getElementsByTagName("body")[0].appendChild(myInstance.hideUserProfileBtn);
          byId("user-profile-btn-ok").addEventListener("click", myInstance.minimizeUIPanel, false);
        }

        (byId("user-points") as HTMLInputElement).value = dataReceive.data.user.points;
        (byId("user-rank") as HTMLInputElement).value = dataReceive.data.user.rank;
        (byId("user-email") as HTMLInputElement).value = dataReceive.data.user.email;
        (byId("nick-name") as HTMLInputElement).value = dataReceive.data.user.nickname;
        byId("log-out").addEventListener("click", myInstance.logOutFromSession, false);
        // Disable for now.
        // byId("out-of-game").addEventListener("click", myInstance.exitCurrentGame, false);
        byId("games-list").addEventListener("click", myInstance.showGamesList, false);
        byId("store-form").addEventListener("click", myInstance.showStore, false);
        byId("set-nickname-profile").addEventListener("click", myInstance.setNewNickName, false);

        const localToken = encodeString(dataReceive.data.user.email);
        myInstance.memo.save("localUserDataE", localToken);
        myInstance.memo.save("localUserRank", dataReceive.data.user.rank);
        myInstance.memo.save("localUserData", dataReceive.data.user.email);
        myInstance.memo.save("token", dataReceive.data.user.token);

      });

    this.memo.save("online", true);

  }

  private minimizeUIPanel = (e) => {

    e.preventDefault();
    this.popupForm.style.display = "none";
    if (byId("user-profile-form")) {
      byId("user-profile-form").style.display = "none";
    }
    byId("user-profile-btn-ok").style.display = "block";
    byId("user-profile-btn-ok").removeEventListener("click", this.minimizeUIPanel, false);
    byId("user-profile-btn-ok").addEventListener("click", this.maximazeUIPanel, false);

  }

  private maximazeUIPanel = (e) => {

    e.preventDefault();
    (this.popupForm as any).style = "";

    if (byId("user-profile-form")) {
      byId("user-profile-form").style.display = "block";
    }
    // byId("user-profile-btn-ok").style.display = "none";
    this.popupForm.style.display = "block";
    byId("user-profile-btn-ok").removeEventListener("click", this.maximazeUIPanel, false);
    byId("user-profile-btn-ok").addEventListener("click", this.minimizeUIPanel, false);

  }

  private showStore = (e) => {
    e.preventDefault();

    const myInstance = this;
    fetch("./templates/store.html", {
      headers: htmlHeader,
    }).
      then(function (res) {
        return res.text();
      }).then(function (html) {

        myInstance.popupForm.innerHTML = html;
        // byId("user-profile-btn-ok").addEventListener("click", myInstance.minimizeUIPanel, false);
        byId("myProfile").addEventListener("click", myInstance.getUserData, false);
        byId("games-list").addEventListener("click", myInstance.showGamesList, false);
        byId("log-out").addEventListener("click", myInstance.logOutFromSession, false);

      });

  }

  private showGamesList = (e) => {
    console.log("showGamesList");
    if (e) { e.preventDefault(); }

    const myInstance = this;
    fetch("./templates/games-list.html", {
      headers: htmlHeader,
    }).
      then(function (res) {
        return res.text();
      }).then(function (html) {

        myInstance.popupForm.innerHTML = html;
        byId("store-form").addEventListener("click", myInstance.showStore, false);
        byId("myProfile").addEventListener("click", myInstance.getUserData, false);
        byId("log-out").addEventListener("click", myInstance.logOutFromSession, false);

        myInstance.gamesList.forEach((item) => {

          const btn = document.createElement("button");
          const t = document.createTextNode(item.title);
          btn.appendChild(t);
          btn.setAttribute("game", item.name);
          btn.setAttribute("id", "openGamePlay");
          btn.setAttribute("class", "link login-button");
          btn.addEventListener("click", myInstance.openGamePlayFor, false);
          byId("games-list-form").appendChild(btn);
          console.log(item);

        });

      });

  }

  private getUserData = () => {

    const localMsg = { action: "GET_USER_DATA", data: { accessToken: this.memo.load("accessToken") } };
    this.sendObject(localMsg);

  }

  private openGamePlayFor = (e) => {

    const myInstance = this;
    e.preventDefault();

    const appStartGamePlay = createAppEvent("game-init",
    {
      mapName: "Level1",
      // game: 'Level1'// myInstance.levelMaps.Level1
    });

    (window as any).dispatchEvent(appStartGamePlay);

    if (e.currentTarget.getAttribute("id") === "openGamePlay") {
      e.currentTarget.disabled = true;
      if (byId("playAgainBtn")) {
        (byId("playAgainBtn") as HTMLButtonElement).disabled = true;
      }
      if (byId("openGamePlay")) {
        (byId("openGamePlay") as HTMLButtonElement).disabled = true;
      }
      byId("user-profile-btn-ok").click();
    }

  }

  private outOfGame = (name: string) => {

    const appEndGamePlay = createAppEvent("game-end",
      {
        game: name,
      });

    (window as any).dispatchEvent(appEndGamePlay);
  }

  private setNewNickName = (e) => {

    e.preventDefault();
    if (this.memo.load("online") === true) {
      const localMsg = {
        action: "NEW_NICKNAME",
        data: {
          newNickname: (byId("nick-name") as HTMLInputElement).value,
          accessToken: this.memo.load("accessToken"),
          email: this.memo.load("localUserData"),
        },
      };
      this.sendObject(localMsg);
    }

  }

  private showNewNickname = (dataReceive) => {
    alert("Nickname field updated successfully.");
  }

  private startNewGame = (gameName: string) => {

    console.log("startNewGame: ", gameName);
    if (this.memo.load("online") === true) {
      const localMsg = {
        action: "GAMEPLAY_START",
        data: {
          gameName,
          rank: this.memo.load("localUserRank"),
          token: this.memo.load("token"),
        },
      };
      this.sendObject(localMsg);
    }

  }

  private exitCurrentGame = () => {

    // pass arg game name in future
    if (this.memo.load("online") === true) {
      const localMsg = {
        action: "OUT_OF_GAME",
        data: {
          token: this.memo.load("token"),
        },
      };
      this.sendObject(localMsg);
    }

  }

  private logOutFromSession = () => {

    if (this.memo.load("online") === true) {
      const localMsg = {
        action: "LOG_OUT",
        data: {
          token: this.memo.load("token"),
        },
      };
      this.sendObject(localMsg);
    }

    this.clearMemo(true);

  }

  private clearMemo = (clearAll?: boolean) => {

    if (clearAll) {
      this.memo.localStorage.clear();
      return "localStorage clared.";
    }

    this.memo.localStorage.removeItem("online");
    this.memo.localStorage.removeItem("accessToken");
    this.memo.localStorage.removeItem("localUserRank");
    this.memo.localStorage.removeItem("nickname");

  }

}
export default ConnectorClient;
