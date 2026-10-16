"use client";
import MuxVideo from "@mux/mux-video-react";
import { useEffect, useState } from "react";

export default function HeroVideo({ playbackId }: { playbackId: string }) {
  const [allowMotion, setAllowMotion] = useState(false);
  const [paused, setPaused] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(
      "(min-width: 769px) and (prefers-reduced-motion: no-preference)",
    );
    const update = () => setAllowMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const id = /^[a-zA-Z0-9]+$/.test(playbackId) ? playbackId : "";
  const poster = id
    ? `https://image.mux.com/${id}/thumbnail.webp?time=0`
    : "/images/home/rambling-pines-camp-intro-video.jpg";
  return (
    <>
      <div
        className="home-video"
        style={{
          backgroundImage: `url("${poster}"), url("/images/home/rambling-pines-camp-intro-video.jpg")`,
        }}
        aria-hidden="true"
      >
        {id && allowMotion && !paused && !failed && (
          <MuxVideo
            playbackId={id}
            poster={poster}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            disableTracking
            onError={() => setFailed(true)}
            tabIndex={-1}
          />
        )}
      </div>
      {id && allowMotion && !failed && (
        <button
          className="home-video-toggle"
          type="button"
          onClick={() => setPaused(!paused)}
        >
          {paused ? "Play background video" : "Pause background video"}
        </button>
      )}
    </>
  );
}
