import React, { useEffect, useState } from "react";
import { voteServiceClient, VoteServiceClientEvent } from "@showdown/gen-client";
import { Tally, VoteGetRequest, VoteGetResponse, VoteAddRequest, VoteAddResponse, VoteAddedEvent } from "@showdown/gen-shared";

const App: React.FC = () => {
  const [tally, setTally] = useState<Tally>({ a: 0, b: 0 });

  const sendVote = async (choice: "A" | "B"): Promise<void> => {
    const request: VoteAddRequest = { choice };
    const response: VoteAddResponse = await voteServiceClient.add(request);

    setTally(response.tally!);
  };

  useEffect(() => {
    const initialize = async () => {
      const request: VoteGetRequest = {};
      const response: VoteGetResponse = await voteServiceClient.get(request);

      setTally(response.tally!);
    };

    initialize();
  }, []);

  useEffect(() => {
    const handleVoteAdded = (response: VoteAddedEvent) => {
      setTally(response.tally!);
    };

    voteServiceClient.on(VoteServiceClientEvent.VoteAdded, handleVoteAdded);

    return () => {
      voteServiceClient.off(VoteServiceClientEvent.VoteAdded, handleVoteAdded);
    };
  }, []);

  return (
    <div>
      <h1>Showdown: Cats vs Dogs</h1>
      <div>
        <button onClick={() => sendVote("A")}>Cats</button>
        <button onClick={() => sendVote("B")}>Dogs</button>
      </div>
      <h2>Live results</h2>
      <div>
        <p>Cats: {tally.a}</p>
        <p>Dogs: {tally.b}</p>
      </div>
    </div>
  );
};

export default App;