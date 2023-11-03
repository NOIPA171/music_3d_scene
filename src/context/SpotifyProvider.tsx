"use client";

import { useSession } from "next-auth/react";
import Head from "next/head";
import Script from "next/script";
import { createContext, useContext, useState, useEffect, useRef } from "react";

const SpotifyContext = createContext<SpotifyProverProps>({
  player: undefined,
  isLoading: false,
  setIsLoading: () => {},
});

const SpotifyProvider = ({ children }: { children: React.ReactNode }) => {
  const { status, data: session } = useSession({
    required: false,
  });
  const [spotifyData, seteSpotifyData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [deviceId, setDeviceId] = useState<string | undefined>();
  const player: { current?: Spotify.Player } = useRef();
  const getPlaybackState = async () => {
    try {
      const res = await fetch("https://api.spotify.com/v1/me/player", {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      console.log("res", res);
      const response = await res.json();
      console.log("response", response);
      seteSpotifyData(response);
      setIsLoading(false);
    } catch (err) {
      console.log("error", err);
      console.log("Please open Spotify to play");
    }
  };

  const initSpotifyPlayer = () => {
    // Using Script generates an error where onSpotifyWebPlaybackSDKReady is undefined
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      player.current = new window.Spotify.Player({
        name: "Web Playback SDK",
        getOAuthToken: (cb) => {
          cb(session?.accessToken as string);
        },
        volume: 0.5,
      });

      player.current.addListener("ready", ({ device_id }) => {
        setDeviceId(device_id);
      });

      player.current.addListener("not_ready", () => {
        setDeviceId(undefined);
      });

      player.current.connect();
    };
  };

  useEffect(() => {
    if (status === "authenticated") {
      initSpotifyPlayer();
    }
  }, [status]);

  const transferPlayback = async () => {
    const res = await fetch("https://api.spotify.com/v1/me/player", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        device_ids: [deviceId],
        play: true,
      }),
    });

    console.log("transferPlayback", res);
  };

  useEffect(() => {
    if (deviceId) {
      transferPlayback();
    }
  }, [deviceId]);

  const values: SpotifyProverProps = {
    player: player.current,
    isLoading,
    setIsLoading,
  };

  return (
    <>
      <SpotifyContext.Provider value={values}>
        {children}
      </SpotifyContext.Provider>
    </>
  );
};

export default SpotifyProvider;

export const useSpotify = () => {
  const spotifyData = useContext(SpotifyContext);
  return spotifyData;
};
