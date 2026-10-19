import { Client, RootServerException } from "@rootsdk/server-app";
import {
  Likes,
  LikesError,
  LikesGetRequest,
  LikesGetResponse,
  LikesGiveRequest,
  LikesGiveResponse,
  LikesClearRequest,
  LikesClearResponse,
} from "@localization/gen-shared";
import { LikesServiceBase } from "@localization/gen-server";

export class LikesService extends LikesServiceBase {
  private likes: Likes = { count: 0, lastGivenAt: 0 };

  async get(request: LikesGetRequest, client: Client): Promise<LikesGetResponse> {
    return { likes: this.likes };
  }

  async give(request: LikesGiveRequest, client: Client): Promise<LikesGiveResponse> {
    this.likes = { count: this.likes.count + 1, lastGivenAt: Date.now() };
    this.broadcastChanged({ likes: this.likes }, "all", client);
    return { likes: this.likes };
  }

  async clear(request: LikesClearRequest, client: Client): Promise<LikesClearResponse> {
    if (this.likes.count === 0) {
      throw new RootServerException(LikesError.NOTHING_TO_CLEAR, "There are no likes to clear.");
    }

    this.likes = { count: 0, lastGivenAt: 0 };
    this.broadcastChanged({ likes: this.likes }, "all", client);
    return { likes: this.likes };
  }
}

export const likesService = new LikesService();
