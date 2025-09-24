import { Client } from "@rootsdk/server-app";
import { Tally, VoteGetRequest, VoteGetResponse, VoteAddRequest, VoteAddResponse, VoteAddedEvent } from "@showdown/gen-shared";
import { VoteServiceBase } from "@showdown/gen-server";

export class VoteService extends VoteServiceBase {
  private static tallyA = 0;
  private static tallyB = 0;

  async get(request: VoteGetRequest, client: Client): Promise<VoteGetResponse> {
    const tally: Tally = { a: VoteService.tallyA, b: VoteService.tallyB };

    const response: VoteGetResponse = { tally: tally };

    return response;
  }

  async add(request: VoteAddRequest, client: Client): Promise<VoteAddResponse> {
    if (request.choice === "A")
      VoteService.tallyA++;
    else if (request.choice === "B")
      VoteService.tallyB++;

    const tally: Tally = { a: VoteService.tallyA, b: VoteService.tallyB };

    const event: VoteAddedEvent = { tally: tally };
    this.broadcastVoteAdded(event, "all", client);

    const response: VoteAddResponse = { tally: tally };
    return response;
  }
}

export const voteService = new VoteService();
