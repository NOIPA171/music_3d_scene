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
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // is fetching Spotify API

  const { player } = useSpotify();
  useEffect(() => {
    // const getPlaybackState = async () => {
    //   try {
    //     const res = await fetch("https://api.spotify.com/v1/me/player", {
    //       headers: {
    //         Authorization: `Bearer ${session?.accessToken}`,
    //       },
    //     });
    //     console.log("res", res);
    //     const response = await res.json();
    //     setIsPlaying(response.is_playing);
    //     setIsLoading(false);
    //   } catch (err) {
    //     console.log("error", err);
    //     console.log("Please open Spotify to play");
    //   }
    // };
    // if (status === "authenticated") {
    //   getPlaybackState();
    // }
  }, [status]);

  const togglePlayback = async () => {
    // prevent user from clicking it multiple times
    if (isLoading) return;

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
      Player
      <button onClick={() => togglePlayback()}>
        {isPlaying ? "Pause" : "Play"}
      </button>
      <button
        onClick={() =>
          player.togglePlay().then(() => {
            console.log("toggled playback");
          })
        }
      >
        Toggle play
      </button>
      <button
        onClick={() => {
          player.getCurrentState().then((state: any) => {
            if (!state) {
              console.error(
                "User is not playing music through the Web Playback SDK"
              );
              return;
            }

            var current_track = state.track_window.current_track;
            var next_track = state.track_window.next_tracks[0];

            console.log("Currently Playing", current_track);
            console.log("Playing Next", next_track);
          });
        }}
      >
        Check state
      </button>
    </div>
  );
};
export default Player;
