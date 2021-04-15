import { byId, htmlHeader } from "./system";

class MessageBox {

  private popup: HTMLDivElement;

  private showOnInit: boolean = false;
  private welcomeMessage: string = "This application was created on visual-ts n\ Example: Real time multiplayer `Platformer` zlatnaspirala@gmail.com";
  private messageBox: HTMLElement = byId("message-box");
  private messageBoxContent: HTMLElement;
  private messageBoxContentFlag: string;
  private asynContentFlag: boolean = false;

  constructor() {

    this.popup = byId("message-box") as HTMLDivElement;
    this.init();
    // console.info("MessageBox is constructed.");

  }

   public show (content: string) {

    try {
      this.messageBoxContentFlag = content;
      this.messageBox.classList.remove("message-box-hide-animation");
      this.messageBox.classList.add("message-box-show-animation");
      this.messageBoxContent = byId("message-box-content") as HTMLElement;
      this.messageBoxContent.innerText = content;
      // Must be sync with css duration value
      this.messageBox.style.display = "block";
    } catch (err) {
      this.asynContentFlag = true;
      // console.warn("Initialisation depens on async call. If you wanna startup message box \
      // setup showOnInit = true.", error);
    }

  }

  private hide (e) {

    const messageBox = e.currentTarget.parentElement.parentElement;
    messageBox.classList.remove("message-box-show-animation");
    messageBox.classList.add("message-box-hide-animation");
    // Must be sync with css duration value
    setTimeout(function () {
      messageBox.style.display = "none";
    }, 1000);

  }

  private init = () => {

    const myInstance = this;

    fetch("./templates/message-box.html", {
      headers: htmlHeader,
    }).
      then(function (res) {
        return res.text();
      }).then(function (html) {

        myInstance.popup.innerHTML = html;

        if (myInstance.showOnInit) {
          myInstance.popup.style.display = "block";
        } else {
          myInstance.popup.style.display = "none";
        }
        myInstance.popup.classList.add("message-box-show-animation");
        myInstance.messageBox.classList.remove("message-box-hide-animation");
        myInstance.messageBoxContent = byId("message-box-content") as HTMLElement;
        myInstance.messageBoxContent.innerHTML = myInstance.welcomeMessage;
        console.info("MessageBox is ready. Test");
        if (byId("message-box-btn") !== undefined && byId("message-box-btn") !== null) {
          byId("message-box-btn").addEventListener("click", myInstance.hide, false);
        }
        if (myInstance.asynContentFlag) {
          myInstance.asynContentFlag = false;
          myInstance.messageBoxContent.innerHTML = myInstance.messageBoxContentFlag;
          myInstance.popup.style.display = "block";
        }
      });

  }

}
export default MessageBox;
