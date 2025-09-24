import React, { useState, useEffect } from "react";
import { useSuggestionCacheContext } from "../../context/SuggestionContext";

export const AddSuggestion: React.FC = () => {
  const placeholder: string = "Enter suggestion";
  const [text, setText] = useState("");

  const { createSuggestion, error, clearError } = useSuggestionCacheContext();

  const handleAddSuggestionClick = async () => {
      await createSuggestion(text);
      setText("");
  };

  // Clear error when user starts typing
  useEffect(() => {
    if (error && text.trim() !== "") {
      clearError();
    }
  }, [text, error, clearError]);

  return (
    <div>
      {error && (
        <div className="error-banner">
          {error}
          <button onClick={clearError}>Dismiss</button>
        </div>
      )}
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
      />
      <button onClick={handleAddSuggestionClick}>Create new suggestion</button>
    </div>
  );
};
