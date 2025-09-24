import { useState, useEffect, useCallback } from "react";
import { rootClient, RootServerException } from "@rootsdk/client-app";
import { SuggestionBoxError } from "@suggestionbox/shared";

import {
  Suggestion,

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

  VoteAddRequest,
  VoteAddResponse,
  VoteAddedEvent
} from "@suggestionbox/gen-shared";

import {
  suggestionServiceClient,
  SuggestionServiceClientEvent,
  voteServiceClient,
  VoteServiceClientEvent
} from "@suggestionbox/gen-client";

export function useSuggestionCache() {
  const [suggestions, setSuggestions] = useState<Map<number, Suggestion>>(new Map<number, Suggestion>());

  const [error, setError] = useState<string | null>(null);
  const clearError = () => setError(null);

  function updateSuggestions(updater: (currentMap: Map<number, Suggestion>) => void): void {
    setSuggestions((prev) => {
      const newMap = new Map(prev);
      updater(newMap);
      return newMap;
    });
  }

  //
  // Initialization
  //

  const initialize = useCallback(async (): Promise<void> => {
    const request : SuggestionListRequest = {}; // request is currently unused/empty
    const response: SuggestionListResponse = await suggestionServiceClient.list(request);

    const temp = new Map<number, Suggestion>();
    response.suggestions.forEach((suggestion: Suggestion) => temp.set(suggestion.id, suggestion));

	setSuggestions(temp);
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  //
  // Handle when this client creates/updates/deletes suggestions and votes
  //

  const createSuggestion = useCallback(async (text: string): Promise<void> => {
    // create the suggestion on the server
    const request: SuggestionCreateRequest = { text };
    const response: SuggestionCreateResponse = await suggestionServiceClient.create(request);

    if (response.success) {
      // add the new suggestion to the client-side cache
      updateSuggestions((map) => { map.set(response.suggestion!.id, response.suggestion!); });
    } else {
      setError("That suggestion already exists. Please try again.");
    }
  },
  [updateSuggestions]);

  // Note: the update operation is not implemented in UI to keep the example simple
  const updateSuggestion = useCallback(async (id: number, text: string): Promise<void> => {
      // update the suggestion on the server
      const request: SuggestionUpdateRequest = { id, text };
      const response: SuggestionUpdateResponse = await suggestionServiceClient.update(request); // response is intentionally empty

      // update the suggestion in the client-side cache
      updateSuggestions((map) => {
        const suggestion = map.get(id);
        if (suggestion) {
          suggestion.text = text;
        }
      });
    },
    [updateSuggestions]
  );

  const deleteSuggestion = useCallback(async (id: number): Promise<void> => {
    try {
      // delete the suggestion on the server
      const request: SuggestionDeleteRequest = { id: id };
      const response: SuggestionDeleteResponse = await suggestionServiceClient.delete(request); // response is intentionally empty

      // delete the suggestion from the client-side cache
      updateSuggestions((map) => { map.delete(id); });
    } catch (error) {
      if (error instanceof RootServerException) {
        if (error.code === SuggestionBoxError.NOT_FOUND) {
          // Optionally add user notification here (omitted for simplicity)
          rootClient.lifecycle.restart();
        }
      }
    }
  },
    [updateSuggestions]
  );

const addVote = useCallback(async (id: number): Promise<void> => {
  try {
    // add the vote on the server
    const request: VoteAddRequest = { suggestionId: id };
    const response: VoteAddResponse = await voteServiceClient.add(request); // response is intentionally empty

    // add the vote to the client-side cache
    const currentUserId = rootClient.users.getCurrentUserId();
    updateSuggestions((map) => {
      const suggestion = map.get(id);
      if (suggestion) {
        suggestion.voterIds.push(currentUserId);
      }
    });
  } catch (error) {
    if (error instanceof RootServerException) {
      switch (error.code) {
        case SuggestionBoxError.NOT_FOUND:
          // Optionally add user notification here (omitted for simplicity)
          rootClient.lifecycle.restart();
          break;
        case SuggestionBoxError.DUPLICATE_VOTE:
          // Optionally add user notification here (omitted for simplicity)
          rootClient.lifecycle.restart();
          break;
      }
    } else {
      // Optionally add user notification here (omitted for simplicity)
      rootClient.lifecycle.restart();
    }
  }
}, [updateSuggestions]);

  //
  // Get notified when other clients create/update/delete/vote
  //

  useEffect(() => {
    const onCreated = (event: SuggestionCreatedEvent) => {
      updateSuggestions((map) => { map.set(event.suggestion!.id, event.suggestion!); });
    };

    const onUpdated = (event: SuggestionUpdatedEvent) => {
      updateSuggestions((map) => { map.set(event.suggestion!.id, event.suggestion!); });
    };

    const onDeleted = (event: SuggestionDeletedEvent) => {
      updateSuggestions((map) => { map.delete(event.id); });
    };

    const onVoteAdded = (event: VoteAddedEvent) => {
      updateSuggestions((map) => { map.set(event.suggestion!.id, event.suggestion!); });
    };

    suggestionServiceClient.on(SuggestionServiceClientEvent.Created, onCreated);
    suggestionServiceClient.on(SuggestionServiceClientEvent.Updated, onUpdated);
    suggestionServiceClient.on(SuggestionServiceClientEvent.Deleted, onDeleted);
    voteServiceClient.on(VoteServiceClientEvent.Added, onVoteAdded);

    return () => {
      suggestionServiceClient.off(SuggestionServiceClientEvent.Created, onCreated);
      suggestionServiceClient.off(SuggestionServiceClientEvent.Updated, onUpdated);
      suggestionServiceClient.off(SuggestionServiceClientEvent.Deleted, onDeleted);
      voteServiceClient.off(VoteServiceClientEvent.Added, onVoteAdded);
    };
  }, [updateSuggestions]);

  return {
    suggestions,
    createSuggestion,
    updateSuggestion,
    deleteSuggestion,
    addVote,
    error,
    clearError,
  };
}