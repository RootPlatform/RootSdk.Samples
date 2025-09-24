import { createContext, useContext, ReactNode } from "react";
import { useSuggestionCache } from "../hooks/useSuggestionCache";
import { Suggestion } from "@suggestionbox/gen-shared";

interface SuggestionCacheContextType {
  suggestions: Map<number, Suggestion>;
  createSuggestion: (text: string) => Promise<void>;
  updateSuggestion: (id: number, text: string) => void;
  deleteSuggestion: (id: number) => void;
  addVote: (id: number) => void;
  error: string | null;
  clearError: () => void;
}

const SuggestionCacheContext = createContext<SuggestionCacheContextType | null>(
  null
);

export function SuggestionCacheProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const suggestionCache = useSuggestionCache();

  return (
    <SuggestionCacheContext.Provider value={suggestionCache}>
      {children}
    </SuggestionCacheContext.Provider>
  );
}

export function useSuggestionCacheContext(): SuggestionCacheContextType {
  const context = useContext(SuggestionCacheContext);

  if (!context) {
    throw new Error(
      "useSuggestionCacheContext must be used within a SuggestionCacheProvider"
    );
  }

  return context;
}
