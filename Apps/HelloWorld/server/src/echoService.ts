import { Client } from "@rootsdk/server-app";
import { EchoRequest, EchoResponse, EchoEvent } from "@echo/gen-shared";
import { EchoServiceBase } from "@echo/gen-server";

export class EchoService extends EchoServiceBase {
  async echo(request: EchoRequest, client: Client): Promise<EchoResponse> {
    const echoReply = "Echo server: " + request.message;

    // Broadcast to all other clients
    const event: EchoEvent = { message: echoReply };
    this.broadcastMessage(event, "all", client);

    // Respond to the client that sent the original message
    const response: EchoResponse = { message: echoReply };
    return response;
  }
}

export const echoService = new EchoService();
