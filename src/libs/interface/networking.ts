
/**
 * @description
 * webRTC catch real object.
 * Make clear situation arround networking.
 */

export interface IMultiplayer {
  multiPlayerRef: BaseMultiPlayer;
  netBodies: any;
}

export interface IBroadcasterSession {
  sessionAudio: boolean;
  sessionVideo: boolean;
  sessionData: boolean;
  enableFileSharing: boolean;
}

export interface BaseMultiPlayer {
  root: any;
  init(rtcEvent): void;
  update(multiplayer): void;
  leaveGamePlay(rtcEvent): void;
}

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
