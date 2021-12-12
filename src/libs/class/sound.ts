import { ISound } from "../interface/global";

class Sound implements ISound {

  public name: string = "audio-staff";
  public noSound: boolean = false;

  private audioBox: {[key: string]: any} = {};
  private aContainer: HTMLElement;

  constructor(name: string) {

    this.name = name;

    this.aContainer = document.createElement("div");
    this.aContainer.setAttribute("id", "audio-box");
    document.body.appendChild(this.aContainer);

  }

  public createAudio (path, idCaller, loop?, autoplay?): void {

    if (typeof path === undefined || idCaller === undefined) {
      console.warn("You can't create audio object without src attribute and id value.");
      return;
    }

    // tslint:disable-next-line:prefer-const
    let element = document.createElement("audio");

    if (typeof autoplay === undefined) {
      autoplay = false;
    }

    if (typeof loop === undefined) {
      loop = false;
    }

    element.setAttribute("id", idCaller);
    if (element.canPlayType("audio/mpeg")) {
      element.setAttribute("src", path);
    } else {
      element.setAttribute("src", path);
    }

    this.audioBox[idCaller] = element;
    this.aContainer.appendChild(this.audioBox[idCaller]);

    element.addEventListener("canplaythrough", function () {

      const testPlay = this.play();

      if (testPlay !== undefined) {
        testPlay.then(function () {
          // Automatic playback started!
        }).catch(function (error) {
          console.warn("Audio with id can't play at the moment. Error: ", error);
        });
      }

    }, false);

  }

  public playById(id) {

    if (this.noSound) return;

    const testPlay = this.audioBox[id].play();

    if (testPlay !== undefined) {
      testPlay.then(function () {
        // Automatic playback started!
      }).catch(function (error) {
        console.warn("Audio with id" + id + " can't play at the moment." );
      });
    }

  }
}
export default Sound;
