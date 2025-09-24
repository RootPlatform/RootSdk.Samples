import { Client, RootServerException } from "@rootsdk/server-app";
import { VoteAddRequest, VoteAddResponse, VoteAddedEvent } from "@suggestionbox/gen-shared";
import { VoteServiceBase } from "@suggestionbox/gen-server";
import { SuggestionModel, suggestionRepository } from "./suggestionRepository";
import { SuggestionMapper } from "./utilities";
import { SuggestionBoxError } from "@suggestionbox/shared";

export class VoteService extends VoteServiceBase {

async add(request: VoteAddRequest, client: Client): Promise<VoteAddResponse> {
    const suggestionModel: SuggestionModel | SuggestionBoxError = await suggestionRepository.addVote(request.suggestionId, client.userId);

    if (suggestionModel === SuggestionBoxError.NOT_FOUND) {
      const message = "VoteService.add: attempt to add vote to suggestion that doesn't exist";
      console.error(message);
      throw new RootServerException(SuggestionBoxError.NOT_FOUND, message);
    }

    if (suggestionModel === SuggestionBoxError.DUPLICATE_VOTE) {
      const message = "VoteService.add: attempted duplicate vote.";
      console.error(message);
      throw new RootServerException(SuggestionBoxError.DUPLICATE_VOTE, message);
    }

    const event: VoteAddedEvent = { suggestion: SuggestionMapper.toDto(suggestionModel as SuggestionModel) };
    this.broadcastAdded(event, "all", client);

    const response: VoteAddResponse = {}; // Intentionally empty
    return response;
  }
}

export const voteService = new VoteService();
