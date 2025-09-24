import React, { useEffect, useState } from "react";
import { useSuggestionCacheContext } from "../../context/SuggestionContext";
import "./SuggestionList.css";
import { Timestamp } from "@suggestionbox/gen-shared";
import { rootClient } from "@rootsdk/client-app";

export const SuggestionList: React.FC = () => {
  const { suggestions, addVote, deleteSuggestion } = useSuggestionCacheContext();

  const [userVoteStatus, setUserVoteStatus] = useState<Map<number, boolean>>(new Map());

  useEffect(() => {
    const checkVotes = async () => {
      const statusMap = new Map<number, boolean>();

      for (const suggestion of suggestions.values()) {
        const hasVoted = suggestion.voterIds.includes(rootClient.users.getCurrentUserId());
        statusMap.set(suggestion.id, hasVoted);
      }

      setUserVoteStatus(statusMap);
    };

    checkVotes();
  }, [suggestions]);

  const handleDelete  = async (id: number) => { await deleteSuggestion(id); };
  const handleAddVote = async (id: number) => { await addVote(id); };

  return (
    <div>
      <h2>Suggestions</h2>
      <ul className="suggestion-list">
        {Array.from(suggestions.values()).map((suggestion) => (
          <li
            key={suggestion.id}
            className="suggestion-item">
            <p className="suggestion-text">
              <strong>{suggestion.text}</strong>
            </p>
            <p className="suggestion-date">
              {Timestamp.toDate(suggestion.createdAt!).toDateString()}
            </p>
            <div className="suggestion-vote-container">
              <button
                className="vote-button"
                onClick={() => handleAddVote(suggestion.id)}
                disabled={userVoteStatus.get(suggestion.id) || false}>
                👍 Vote
              </button>

              <span>{suggestion.voterIds.length} votes</span>

              {suggestion.authorId === rootClient.users.getCurrentUserId() && (
                <button
                  className="delete-button"
                  onClick={() => handleDelete(suggestion.id)}
                  title="Delete Suggestion">
                  🗑️
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
