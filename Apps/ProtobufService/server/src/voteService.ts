import { Client, RootServerException } from "@rootsdk/server-app";
import { Tally, VoteGetRequest, VoteGetResponse, VoteAddRequest, VoteAddResponse, VoteAddedEvent } from "@showdown/gen-shared";
import { VoteServiceBase } from "@showdown/gen-server";

export class VoteService extends VoteServiceBase {
  private tallyA = 0;
  private tallyB = 0;

  async get(request: VoteGetRequest, client: Client): Promise<VoteGetResponse> {
    const tally: Tally = { a: this.tallyA, b: this.tallyB };

    return { tally };
  }

  async add(request: VoteAddRequest, client: Client): Promise<VoteAddResponse> {
    if (request.choice === "A")
      this.tallyA++;
    else if (request.choice === "B")
      this.tallyB++;
    else
      throw new RootServerException(1, "Invalid choice: must be 'A' or 'B'");

    const tally: Tally = { a: this.tallyA, b: this.tallyB };

    const event: VoteAddedEvent = { tally };
    this.broadcastVoteAdded(event, "all", client);

    return { tally };
  }
}

export const voteService = new VoteService();
