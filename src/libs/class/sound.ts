interface ISound {
  name: string;
}

class Sound implements ISound {

  public name: string = "audio-staff";

  constructor(name: string) {
    this.name = name;

    // console.log("Sound constructed" + name);
  }
}
export default Sound;
