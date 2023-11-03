"use client";
import { useEffect, useState } from "react";
// need AuthProvider for client components to use useSession
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useSpotify } from "@/context/SpotifyProvider";

const Player = () => {
  const { status, data: session } = useSession({
    required: false,
  });
  const {
    hasDevice,
    initPlayer,
    isLoading,
    setIsLoading,
    isPlaying,
    setIsPlaying,
  } = useSpotify();

  const togglePlayback = async () => {
    // prevent user from clicking it multiple times
    // if (isLoading) return;

    setIsLoading(true);
    const res = await fetch(
      `https://api.spotify.com/v1/me/player/${isPlaying ? "pause" : "play"}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      }
    );
    if (res.status === 204 && res.ok === true) {
      setIsPlaying((prev) => !prev);
    }
    setIsLoading(false);
  };

  return (
    <div>
      <div>Player</div>
      {isLoading ? (
        "loading"
      ) : hasDevice ? (
        <button onClick={() => togglePlayback()}>
          {isPlaying ? "Pause" : "Play"}
        </button>
      ) : (
        <div>
          No device available,{" "}
          <a
            href="https://open.spotify.com/"
            target="_blank"
            rel="noreferrer noopener"
          >
            open Spotify
          </a>{" "}
          to control your music on this interface
          <button onClick={() => initPlayer()}>Refresh</button>
        </div>
      )}

      <div />
    </div>
  );
};
export default Player;
