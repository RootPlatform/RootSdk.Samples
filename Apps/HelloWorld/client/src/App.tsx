import React, { useState, useEffect } from "react";
import { echoServiceClient, EchoServiceClientEvent } from "@echo/gen-client";
import { EchoRequest, EchoResponse, EchoEvent } from "@echo/gen-shared";

const App: React.FC = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");

  //
  // This client sends a message
  //
  const send = async (): Promise<void> => {
    try {
      const request: EchoRequest = { message: inputText };

      const response: EchoResponse = await echoServiceClient.echo(request);

      setOutputText(response.message);
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  //
  // Subscribe to event to receive broadcast when other clients send messages
  //
  const handleMessage = (event: EchoEvent): void => { setOutputText(event.message); };

  useEffect(() => {
    echoServiceClient.on(EchoServiceClientEvent.Message, handleMessage);
    return () => {
      echoServiceClient.off(EchoServiceClientEvent.Message, handleMessage);
    };
  }, []);

  //
  // Simple HTML UI
  //
  return (
    <div>
      <input
        type="text"
        placeholder="Enter message..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <button onClick={send}>Send</button>
      <div>{outputText}</div>
    </div>
  );
};

export default App;
