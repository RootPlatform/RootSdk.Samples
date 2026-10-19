import React, { useEffect, useState } from "react";
import { RootServerException } from "@rootsdk/client-app";
import { likesServiceClient, LikesServiceClientEvent } from "@localization/gen-client";
import { LikesError, LikesResponse } from "@localization/gen-shared";
import { currentLanguageName, formatTimeAgo, translate, translatePlural } from "./translations/translate";

function translateError(error: unknown): string {
  if (error instanceof RootServerException && error.code === LikesError.NOTHING_TO_CLEAR) {
    return translate("error.NOTHING_TO_CLEAR");
  }
  return translate("error.generic");
}

const App: React.FC = () => {
  const [likeCount, setLikeCount] = useState(0);
  const [lastLikedAt, setLastLikedAt] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentTime, setCurrentTime] = useState(Date.now());

  const showLikes = (likes: LikesResponse): void => {
    setLikeCount(likes.count);
    setLastLikedAt(likes.lastLikedAt);
  };

  useEffect(() => {
    likesServiceClient
      .getLikes({})
      .then(showLikes)
      .catch((error) => setErrorMessage(translateError(error)));

    likesServiceClient.on(LikesServiceClientEvent.LikesChanged, showLikes);

    const clock = setInterval(() => setCurrentTime(Date.now()), 30000);

    return () => {
      likesServiceClient.off(LikesServiceClientEvent.LikesChanged, showLikes);
      clearInterval(clock);
    };
  }, []);

  const handleLikeClick = async (): Promise<void> => {
    setErrorMessage("");
    try {
      showLikes(await likesServiceClient.addLike({}));
    } catch (error) {
      setErrorMessage(translateError(error));
    }
  };

  const handleClearClick = async (): Promise<void> => {
    setErrorMessage("");
    try {
      showLikes(await likesServiceClient.clearLikes({}));
    } catch (error) {
      setErrorMessage(translateError(error));
    }
  };

  return (
    <div>
      <h1>{translate("app.title")}</h1>

      <p>{likeCount === 0 ? translate("likes.none") : translatePlural("likes.count", likeCount)}</p>

      {lastLikedAt > 0 && (
        <p>{translate("likes.lastLiked", { time: formatTimeAgo(lastLikedAt, currentTime) })}</p>
      )}

      <button onClick={handleLikeClick}>{translate("action.like")}</button>
      <button onClick={handleClearClick}>{translate("action.clear")}</button>

      {errorMessage && <p role="alert">{errorMessage}</p>}

      <p>{translate("app.language", { language: currentLanguageName })}</p>
    </div>
  );
};

export default App;
