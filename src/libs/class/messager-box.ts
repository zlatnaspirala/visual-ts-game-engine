import { htmlHeader, byId } from "./system";

class MessageBox {

  private popup: HTMLDivElement;

  private showOnInit: boolean = false;
  private welcomeMessage: string = "This application was created on visual-ts n\ Example: Real time multiplayer `Platformer` zlatnaspirala@gmail.com";
  private messageBoxContent: HTMLElement;
  private messageBoxContentFlag: string;
  private asynContentFlag: boolean = false;

  constructor() {
    console.warn("MessageBox is constructed.");
    this.popup = byId("message-box") as HTMLDivElement;
    this.init();

  }

   public show (content: string) {

    try {
      this.messageBoxContentFlag = content;
      const messageBox = byId("message-box");
      messageBox.classList.remove("message-box-hide-animation");
      messageBox.classList.add("message-box-show-animation");
      this.messageBoxContent = byId("message-box-content");
      this.messageBoxContent.innerText = content;
      // Must be sync with css duration value
      messageBox.style.display = "block";
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
    setTimeout(function() {
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
        myInstance.messageBoxContent = byId("message-box-content");
        myInstance.messageBoxContent.innerHTML = myInstance.welcomeMessage;
        console.info("MessageBox is ready.");
        byId("message-box-btn").addEventListener("click", myInstance.hide, false);

        if (myInstance.asynContentFlag) {
          myInstance.asynContentFlag = false;
          myInstance.messageBoxContent.innerHTML = myInstance.messageBoxContentFlag;
          myInstance.popup.style.display = "block";
        }
      });

  }

}
export default MessageBox;
