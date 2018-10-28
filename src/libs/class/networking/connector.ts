import { byId } from "../system";
import EngineConfig from "./../../client-config";

class ConnectorClient {

  private webSocketController;

  constructor(config: EngineConfig) {

    console.warn("ConnectorClient running...");

    this.webSocketController = new WebSocket(config.getRemoteServerAddressControlller());
    this.webSocketController.onopen = this.onOpen;
    this.webSocketController.onclose = this.onClose;
    this.webSocketController.onmessage = this.onMessage;
    this.webSocketController.onerror = this.onError;
    window.WWW = this;

  }

  private onOpen = () => {

    console.warn("CONNECTED", JSON.stringify({ data: "very good" }));

    this.webSocketController.send(JSON.stringify({ data: "very good" }));

    // this.webSocketController.send("very good2");
  }

  private sendM(message) {

    message = JSON.stringify(message);

    console.warn(message, "SEND!");

    if (!message) {
      console.error("no such channel exists");
      return;
    }

    try {
      // tslint:disable-next-line:no-unused-expression
      () => this.webSocketController.sendUTF(message);
    } catch (e) {
      console.warn("Error", e);
    }
  }
  private onClose(evt) {
    console.warn("DISCONNECTED");
  }

  private onMessage(evt) {
    console.warn("RESPONSE: " + evt.data);
    // websocket.close();
  }

  private onError(evt) {
    console.warn("onError" + evt.data);
  }

}
export default ConnectorClient;
