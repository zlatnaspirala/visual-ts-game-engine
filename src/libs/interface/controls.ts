
interface IControlsArea {
  l: number;
  t: number;
  w: number;
  h: number;
  left: () => number;
  top: () => number;
  width: () => number;
  height: () => number;
}

export default IControlsArea;