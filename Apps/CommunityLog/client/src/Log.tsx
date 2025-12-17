import React, { useState } from "react";
import { communityLogServiceClient } from "@CommunityLogStressTest/gen-client";
import { CreateCommunityLogMessageRequest, Severity } from "@CommunityLogStressTest/gen-shared";

const Log: React.FC = () => {
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<Severity>(Severity.INFO);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const request: CreateCommunityLogMessageRequest = {
      message: message,
      severity: severity,
    };

    await communityLogServiceClient.create(request);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, padding: 16 }}>
      <h2>Community Log Message</h2>

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

      <button type="submit" style={{ marginTop: 16 }}>
        Send log
      </button>
    </form>
  );
};

export default Log;
