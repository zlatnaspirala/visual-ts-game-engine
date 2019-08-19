import { htmlHeader, byId } from "./system";

class messageBox {

  private popup: HTMLDivElement;

  constructor() {
    // empty
    this.popup = byId("message-box") as HTMLDivElement;
  }

  private show = () => {

    const myInstance = this;

    fetch("./templates/message-box.html", {
      headers: htmlHeader,
    }).
      then(function (res) {
        return res.text();
      }).then(function (html) {

        myInstance.popup.innerHTML = html;
        myInstance.popup.style.display = "block";
        // byId("myProfile").addEventListener("click", myInstance.getUserData, false);

      });

  }

}
export default messageBox;
