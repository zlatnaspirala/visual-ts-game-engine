class EngineConfig {

  private drawReference: string = "frame";
  private aspectRatio: number = 1.333;

  constructor() {
    // empty for now
  }

   public getDrawRefference(): string {
     return this.drawReference;
   }

   public getAspectRatio(): number {
     return this.aspectRatio;
   }

   public setAspectRatio(newAspectRatio: number) {
    this.aspectRatio = newAspectRatio;
   }

}
export default EngineConfig;
