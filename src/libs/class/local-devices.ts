import { createAppEvent } from "./system";

export default class LocalDevice {

  public getLocalWebcam() {
    var video = document.getElementsByTagName("video")[0] as HTMLVideoElement;
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
          video.srcObject = stream;
          const local = createAppEvent("local-stream-loaded", {
            stream: stream,
          });
          (window as any).dispatchEvent(local);
        })
        .catch(function (err0r) {
          console.log("Something went wrong in webcam access procedure!");
        });
    }
  }

  public stop(e) {
    var video = document.getElementsByTagName("video")[0] as HTMLVideoElement;
    var stream = video.srcObject;
    var tracks = (stream as any).getTracks();
  
    for (var i = 0; i < tracks.length; i++) {
      var track = tracks[i];
      track.stop();
    }
  
    video.srcObject = null;
  }

}