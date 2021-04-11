
import { byId, htmlHeader } from "./system";

class MobileControls {

  constructor() {
    console.info("Player controls class constructed." );
    console.info("not abstract for now it is platformer controller." );
    console.info("Percents used to determinate area dimensions." );
  }

  public detArea = {
    commandLeft: {
      l: 0,
      t: 0,
      w: 40,
      h: 100,
      left: () => window.innerWidth / 100 * this.detArea.commandLeft.l,
      top: () => window.innerHeight / 100 * this.detArea.commandLeft.t,
      width: () => window.innerWidth / 100 * this.detArea.commandLeft.w,
      height: () => window.innerHeight / 100 * this.detArea.commandLeft.h,
    },
    commandRight: {
      l: 60,
      t: 0,
      w: 40,
      h: 100,
      left: () => window.innerWidth / 100 * this.detArea.commandRight.l,
      top: () => window.innerHeight / 100 * this.detArea.commandRight.t,
      width: () => window.innerWidth / 100 * this.detArea.commandRight.w,
      height: () => window.innerHeight / 100 * this.detArea.commandRight.h,
    },
    commandJump: {
      l: 0,
      t: 0,
      w: 100,
      h: 35,
      left: () => window.innerWidth / 100 * this.detArea.commandJump.l,
      top: () => window.innerHeight / 100 * this.detArea.commandJump.t,
      width: () => window.innerWidth / 100 * this.detArea.commandJump.w,
      height: () => window.innerHeight / 100 * this.detArea.commandJump.h,
    }
  }


}
export default MobileControls;
