
/**
 * @description
 * webRTC catch real object.
 * Make clear situation.
 */

export interface RTCDataChannel {}

export interface RTCError {}

export interface RTCErrorEvent {
  bubbles: boolean;
  cancelBubble: boolean;
  cancelable: boolean;
  composed: boolean;
  currentTarget: RTCDataChannel;
  defaultPrevented:  boolean;
  error: RTCError;
  eventPhase: number;
  extra: {};
  isTrusted:  boolean;
  path: Array<any>;
  returnValue:  boolean;
  srcElement: RTCDataChannel;
  target: RTCDataChannel;
  timeStamp: number
  type: string;
  userid: string;
}
