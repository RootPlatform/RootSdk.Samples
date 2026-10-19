import { Client, RootServerException } from "@rootsdk/server-app";
import {
  AddLikeRequest,
  ClearLikesRequest,
  GetLikesRequest,
  LikesError,
  LikesResponse,
} from "@localization/gen-shared";
import { LikesServiceBase } from "@localization/gen-server";

export class LikesService extends LikesServiceBase {
  private likeCount = 0;
  private lastLikedAt = 0;

  async getLikes(request: GetLikesRequest, client: Client): Promise<LikesResponse> {
    return this.currentLikes();
  }

  async addLike(request: AddLikeRequest, client: Client): Promise<LikesResponse> {
    this.likeCount += 1;
    this.lastLikedAt = Date.now();

    this.broadcastLikesChanged(this.currentLikes(), "all", client);
    return this.currentLikes();
  }

  async clearLikes(request: ClearLikesRequest, client: Client): Promise<LikesResponse> {
    if (this.likeCount === 0) {
      throw new RootServerException(LikesError.NOTHING_TO_CLEAR, "There are no likes to clear.");
    }

    this.likeCount = 0;
    this.lastLikedAt = 0;

    this.broadcastLikesChanged(this.currentLikes(), "all", client);
    return this.currentLikes();
  }

  private currentLikes(): LikesResponse {
    return { count: this.likeCount, lastLikedAt: this.lastLikedAt };
  }
}

export const likesService = new LikesService();
