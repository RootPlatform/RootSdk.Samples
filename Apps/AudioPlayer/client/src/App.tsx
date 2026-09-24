import { useEffect, useRef, useState } from "react";

const TRACK = "audio/theme.mp3";
const CLICK = "audio/click.wav";

export default function App() {
  const trackRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const track = new Audio(TRACK);
    track.volume = volume;
    track.loop = true;
    trackRef.current = track;

    const onLoaded = () => setDuration(track.duration);
    const onTime = () => setPosition(track.currentTime);
    const onError = () => setError("The track could not be loaded.");

    track.addEventListener("loadedmetadata", onLoaded);
    track.addEventListener("timeupdate", onTime);
    track.addEventListener("error", onError);

    return () => {
      track.pause();
      track.removeEventListener("loadedmetadata", onLoaded);
      track.removeEventListener("timeupdate", onTime);
      track.removeEventListener("error", onError);
    };
    // The element is created once and kept for the life of the App.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const togglePlay = async () => {
    const track = trackRef.current;
    if (!track) return;

    if (isPlaying) {
      track.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await track.play();
      setError(null);
      setIsPlaying(true);
    } catch {
      setError("Playback failed to start.");
    }
  };

  const changeVolume = (next: number) => {
    setVolume(next);
    if (trackRef.current) trackRef.current.volume = next;
  };

  // A short effect gets its own element each time so overlapping presses stack.
  const playClick = () => {
    const click = new Audio(CLICK);
    click.volume = volume;
    void click.play().catch(() => setError("The effect could not be played."));
  };

  return (
    <div className="app">
      <main className="card">
        <h1 className="title">Audio Player</h1>

        <div className="row">
          <button className="btn" onClick={() => void togglePlay()}>
            {isPlaying ? "Pause" : "Play"}
          </button>
          <span className="time">
            {formatTime(position)} / {formatTime(duration)}
          </span>
        </div>

        <label className="label">
          Volume
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(event) => changeVolume(Number(event.target.value))}
          />
        </label>

        <button className="btn btnSecondary" onClick={playClick}>
          Play an effect
        </button>

        {error && <p className="error">{error}</p>}
      </main>
    </div>
  );
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return "0:00";
  const whole = Math.floor(seconds);
  const minutes = Math.floor(whole / 60);
  return `${minutes}:${String(whole % 60).padStart(2, "0")}`;
}
