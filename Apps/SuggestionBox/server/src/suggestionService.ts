import { Client, RootServerException } from "@rootsdk/server-app";
import { SuggestionServiceBase } from "@suggestionbox/gen-server";
import { suggestionRepository, SuggestionModel } from "./suggestionRepository";
import { SuggestionMapper } from "./utilities";
import { SuggestionBoxError } from "@suggestionbox/shared";

import {
  SuggestionCreateRequest,
  SuggestionCreateResponse,
  SuggestionCreatedEvent,

  SuggestionListRequest,
  SuggestionListResponse,

  SuggestionUpdateRequest,
  SuggestionUpdateResponse,
  SuggestionUpdatedEvent,

  SuggestionDeleteRequest,
  SuggestionDeleteResponse,
  SuggestionDeletedEvent,
} from "@suggestionbox/gen-shared";

export class SuggestionService extends SuggestionServiceBase {

  async create(request: SuggestionCreateRequest, client: Client): Promise<SuggestionCreateResponse> {
    const suggestionModel: SuggestionModel | null = await suggestionRepository.create(client.userId, request.text);

    if (!suggestionModel) {
      const response: SuggestionCreateResponse = { success: false };
      return response;
    }

    const event: SuggestionCreatedEvent = { suggestion: SuggestionMapper.toDto(suggestionModel) };
    this.broadcastCreated(event, "all", client);

    const response: SuggestionCreateResponse = { suggestion: SuggestionMapper.toDto(suggestionModel), success: true };
    return response;
  }

  async list(request: SuggestionListRequest /* request is unused/empty */, client: Client): Promise<SuggestionListResponse> {
    const suggestionModels: SuggestionModel[] = await suggestionRepository.list();

    return { suggestions: suggestionModels.map((s) => SuggestionMapper.toDto(s)) };
  }

  async update(request: SuggestionUpdateRequest, client: Client): Promise<SuggestionUpdateResponse> {
    const suggestionModel = await suggestionRepository.update(request.id, request.text);

    if (!suggestionModel) {
      const message: string = "SuggestionService.update: Suggestion not found or could not be updated.";
      console.error(message);
      throw new RootServerException(SuggestionBoxError.NOT_FOUND, message);
    }

    const event: SuggestionUpdatedEvent = { suggestion: SuggestionMapper.toDto(suggestionModel) };
    this.broadcastUpdated(event, "all", client);

    const response: SuggestionUpdateResponse = {}; // Intentionally empty
    return response;
}

  async delete(request: SuggestionDeleteRequest, client: Client): Promise<SuggestionDeleteResponse> {
    const affectedRows: number = await suggestionRepository.delete(request.id);

    if (affectedRows === 0) {
      const message: string = "SuggestionService.delete: attempt to delete non-existent suggestion.";
      console.error(message);
      throw new RootServerException(SuggestionBoxError.NOT_FOUND, message);
    }

    const event: SuggestionDeletedEvent = { id: request.id };
    this.broadcastDeleted(event, "all", client);

    const response: SuggestionDeleteResponse = {}; // Intentionally empty
    return response;
  }
}

export const suggestionService = new SuggestionService();
