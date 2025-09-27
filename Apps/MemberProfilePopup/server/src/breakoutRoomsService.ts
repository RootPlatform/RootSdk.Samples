import { rootServer, Client } from "@rootsdk/server-app";
import { BreakoutRoom, BreakoutRoomsGetRequest, BreakoutRoomsGetResponse, BreakoutRoomsGetEvent } from "@breakoutrooms/gen-shared";
import { BreakoutRoomsServiceBase } from "@breakoutrooms/gen-server";

export class BreakoutRoomsService extends BreakoutRoomsServiceBase {

  async get(request: BreakoutRoomsGetRequest, client: Client): Promise<BreakoutRoomsGetResponse> {
    const users: string[] = await getAllUserIds();
    const groups: string[][] = partition(request.rooms, users);

    const event: BreakoutRoomsGetEvent = { rooms: toBreakoutRooms(groups) };
    this.broadcastBreakoutRooms(event, "all", client);
	
    const response: BreakoutRoomsGetResponse = { rooms: toBreakoutRooms(groups) };
    return response;
  }
}

async function getAllUserIds(): Promise<string[]>
{
  const clients: Client[] = await rootServer.clients.getClients();
  const userIds: string[] = clients.map((client) => client.userId);

  return userIds;
}

function partition(n: number, data: string[]): string[][] {
  const groups: string[][] = [];

  // Clamp n to data.length if it's too large
  const groupCount = Math.min(n, data.length);

  // Initialize empty groups
  for (let i = 0; i < groupCount; i++) {
    groups.push([]);
  }

  // Distribute items as evenly as possible
  for (let i = 0; i < data.length; i++) {
    groups[i % groupCount].push(data[i]);
  }

  return groups;
}

function toBreakoutRooms(groups: string[][]): BreakoutRoom[] {
  const rooms: BreakoutRoom[] = groups.map(
    (group: string[]): BreakoutRoom => {
      const room: BreakoutRoom = { userIds: group };
      return room;
    });

  return rooms;
}

export const breakoutRoomsService = new BreakoutRoomsService();
