import React from "react";
import { SuggestionCacheProvider } from "./context/SuggestionContext";
import { AddSuggestion } from "./components/AddSuggestion/AddSuggestion";
import { SuggestionList } from "./components/SuggestionList/SuggestionList";

const App: React.FC = () => {
  return (
    <SuggestionCacheProvider>
      <h1>Suggestion Box</h1>

      <AddSuggestion />
      <SuggestionList />
    </SuggestionCacheProvider>
  );
};

export default App;
