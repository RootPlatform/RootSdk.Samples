import React, { useState, useEffect } from "react";
import { rootClient, UserProfile } from "@rootsdk/client-app";
import { breakoutRoomsServiceClient, BreakoutRoomsServiceClientEvent } from "@breakoutrooms/gen-client";
import { BreakoutRoom, BreakoutRoomsGetRequest, BreakoutRoomsGetResponse, BreakoutRoomsGetEvent } from "@breakoutrooms/gen-shared";

const App: React.FC = () => {
  const [groupCount, setGroupCount] = useState<number>(2);
  const [rooms, setRooms] = useState<BreakoutRoom[]>([]);
  const [nicknames, setNicknames] = useState<Record<string, string>>({});

  // This clients initiates the call to getBreakoutRooms
  const send = async (): Promise<void> => {
    const request: BreakoutRoomsGetRequest = { rooms: groupCount };

    const response: BreakoutRoomsGetResponse = await breakoutRoomsServiceClient.get(request);
    setRooms(response.rooms);
  };

  // Handle event when other clients create the breakout groups
  const receive = (event: BreakoutRoomsGetEvent): void => {
    setRooms(event.rooms);
  };

  useEffect(() => {
    breakoutRoomsServiceClient.on(BreakoutRoomsServiceClientEvent.BreakoutRooms, receive);
    return () => {
      breakoutRoomsServiceClient.off(BreakoutRoomsServiceClientEvent.BreakoutRooms, receive);
    };
  }, []);

  // Load the nicknames for all users in all rooms
  useEffect(() => {
    const loadNicknames = async (): Promise<void> => {
      const allUserIds: string[] = rooms.flatMap((room: BreakoutRoom) => room.userIds);
      const profiles: UserProfile[] = await rootClient.users.getUserProfiles(allUserIds);
      const entries: [string, string][] = profiles.map((profile: UserProfile): [string, string] => [profile.id, profile.nickname]);
      setNicknames(Object.fromEntries(entries));
    };

    if (rooms.length > 0) {
      loadNicknames();
    }
  }, [rooms]);

  // Show user profile using the Root SDK popup so your App works and looks like native Root
  const handleUserClick = (userId: string) => {
    rootClient.users.showUserProfile(userId);
  };

  // Simple HTML UI
  return (
    <div>
      <h2>Create breakout groups</h2>
      <input
        type="number"
        value={groupCount}
        min={2}
        onChange={(e) => setGroupCount(parseInt(e.target.value, 10))}
        placeholder="Number of groups"
      />
      <button onClick={send}>Partition into rooms</button>

      <div>
        {rooms.map((room, index) => (
          <div key={index}>
            <p>Group {index + 1}</p>
            <ul>
              {room.userIds.map((userId: string, i: number) => (
              <li key={i}>
                <button onClick={() => handleUserClick(userId)}>
                  {nicknames[userId] || userId}
                </button>
              </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );};

export default App;
