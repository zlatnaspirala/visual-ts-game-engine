import { htmlHeader, byId } from "./system";

class MessageBox {

  private popup: HTMLDivElement;
  private enabled: boolean = true;

  constructor() {

    this.popup = byId("message-box") as HTMLDivElement;

    if (this.enabled) {
      this.init();
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
        myInstance.popup.style.display = "block";
        myInstance.popup.classList.add("message-box-show-animation");
        byId("message-box-btn").addEventListener("click", myInstance.hide, false);

      });

  }

}
export default MessageBox;
