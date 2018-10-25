import EngineConfig from "../../engine-config";
import { byId } from "../system";
import "./socket.io";

class ConnectorClient {

  private socket;

  constructor(config: EngineConfig) {

    this.socket = (window as any).io.connect("http://" + "localhost" + ":" + config.getConnectorPort());

    console.warn("ConnectorClient running...");

    this.socket.on("connect", function () {

      console.warn("Connected with session socket!");

    });

    this.socket.on("realtime", function (eventConnector, dataConnector) {

      if (eventConnector === "registerDoneMailVerification") {

        console.warn("Client event : registerDoneMailVerification ");

      } else if (eventConnector === "registerFeild") {

        console.warn("Client event : registerDoneMailVerification ");

      }

    });

  }

  private register() {

    this.socket.emit("register",
      (byId("login") as HTMLInputElement).value,
      (byId("password") as HTMLInputElement).value);

  }

}
export default ConnectorClient;
