import { htmlHeader, byId } from "./system";

class MessageBox {

  private popup: HTMLDivElement;

  private showOnInit: boolean = true;
  private welcomeMessage: string = "This application was created on visual-ts n\ Example: Real time multiplayer `Platformer` zlatnaspirala@gmail.com";
  private messageBoxContent: HTMLElement;

  constructor() {

    this.popup = byId("message-box") as HTMLDivElement;
    this.init();

  }

   public show (content: string) {

    try {
      const messageBox = byId("message-box");
      messageBox.classList.remove("message-box-hide-animation");
      messageBox.classList.add("message-box-show-animation");
      this.messageBoxContent = byId("message-box-content");
      this.messageBoxContent.innerText = content;
      // Must be sync with css duration value
      messageBox.style.display = "block";
    } catch (err) {
      console.error(err);
      console.warn("Initialisation depens on async call. If you wanna startup message box \
       setup showOnInit = true .");
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
        byId("message-box-btn").addEventListener("click", myInstance.hide, false);

      });

  }

}
export default MessageBox;
