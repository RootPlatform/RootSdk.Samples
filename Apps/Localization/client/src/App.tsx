import React, { useEffect, useState } from "react";
import { RootServerException } from "@rootsdk/client-app";
import { likesServiceClient, LikesServiceClientEvent } from "@localization/gen-client";
import { Likes, LikesChangedEvent, LikesError } from "@localization/gen-shared";
import { formatRelativeTime, languageName, t, tn } from "./i18n";

function errorText(error: unknown): string {
  if (error instanceof RootServerException && error.code === LikesError.NOTHING_TO_CLEAR) {
    return t("error.NOTHING_TO_CLEAR");
  }
  return t("error.generic");
}

const App: React.FC = () => {
  const [likes, setLikes] = useState<Likes>({ count: 0, lastGivenAt: 0 });
  const [error, setError] = useState("");
  const [now, setNow] = useState(Date.now());

  const run = async (action: () => Promise<{ likes?: Likes }>): Promise<void> => {
    try {
      setError("");
      const response = await action();
      if (response.likes) setLikes(response.likes);
    } catch (caught) {
      setError(errorText(caught));
    }
  };

  useEffect(() => {
    void run(() => likesServiceClient.get({}));

    const handleChanged = (event: LikesChangedEvent): void => {
      if (event.likes) setLikes(event.likes);
    };
    likesServiceClient.on(LikesServiceClientEvent.Changed, handleChanged);

    const timer = setInterval(() => setNow(Date.now()), 30000);

    return () => {
      likesServiceClient.off(LikesServiceClientEvent.Changed, handleChanged);
      clearInterval(timer);
    };
  }, []);

  return (
    <div>
      <h1>{t("app.title")}</h1>
      <p>{likes.count === 0 ? t("likes.none") : tn("likes.count", likes.count)}</p>
      {likes.lastGivenAt > 0 && (
        <p>{t("likes.lastGiven", { time: formatRelativeTime(likes.lastGivenAt, now) })}</p>
      )}
      <button onClick={() => run(() => likesServiceClient.give({}))}>{t("action.like")}</button>
      <button onClick={() => run(() => likesServiceClient.clear({}))}>{t("action.clear")}</button>
      {error && <p role="alert">{error}</p>}
      <p>{t("app.language", { language: languageName() })}</p>
    </div>
  );
};

export default App;
