import React, { useState } from "react";
import { communityLogServiceClient } from "@CommunityLogStressTest/gen-client";
import { CreateCommunityLogMessageRequest, Severity } from "@CommunityLogStressTest/gen-shared";

const Log: React.FC = () => {
  const [mode, setMode] = useState<"custom" | "random">("custom");
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<Severity>(Severity.INFO);
  const [count, setCount] = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const request: CreateCommunityLogMessageRequest = {
      message: message,
      severity: severity,
      count: count,
    };

    await communityLogServiceClient.create(request);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, padding: 16 }}>
      <h2>Community Log Message</h2>

      <fieldset style={{ marginBottom: 16 }}>
        <legend><strong>Mode</strong></legend>
        <label style={{ display: "block", marginBottom: 4 }}>
          <input
            type="radio"
            value="custom"
            checked={mode === "custom"}
            onChange={() => setMode("custom")}
          />
          {" "}Custom
        </label>
        <label style={{ display: "block" }}>
          <input
            type="radio"
            value="random"
            checked={mode === "random"}
            onChange={() => setMode("random")}
          />
          {" "}Random
        </label>
      </fieldset>

      {mode === "custom" && (
        <>
          <div style={{ marginTop: 12 }}>
            <label>
              Message:<br />
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                style={{ width: "100%" }}
              />
            </label>
          </div>

          <div style={{ marginTop: 12 }}>
            <label>
              Severity:<br />
              <select value={severity} onChange={(e) => setSeverity(Number(e.target.value))}>
                <option value={Severity.INFO}>Info</option>
                <option value={Severity.WARN}>Warn</option>
                <option value={Severity.ERROR}>Error</option>
                <option value={Severity.FATAL}>Fatal</option>
              </select>
            </label>
          </div>
        </>
      )}

      {mode === "random" && (
        <>
          <div style={{ marginTop: 12 }}>
            <label>
              Number of random messages:<br />
              <input
                type="number"
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                min={1}
                required
              />
            </label>
          </div>

          {/* Hidden values used when in random mode */}
          <input type="hidden" value="Random message" readOnly />
          <input type="hidden" value={Severity.RANDOM} readOnly />
        </>
      )}

      <button type="submit" style={{ marginTop: 16 }}>
        Send log
      </button>
    </form>
  );
};

export default Log;
