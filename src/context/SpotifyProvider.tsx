"use client";

import { useSession } from "next-auth/react";
import { createContext, useContext, useState, useEffect } from "react";

const SpotifyContext = createContext<SpotifyProverProps>({
  currentTrack: undefined,
  isLoading: false,
  setIsLoading: () => {},
  hasDevice: false,
  initPlayer: () => {},
  isPlaying: false,
  setIsPlaying: () => {},
});

const SpotifyProvider = ({ children }: { children: React.ReactNode }) => {
  const { status, data: session } = useSession({
    required: false,
  });

  const [currentTrack, setCurrentTrack] =
    useState<SpotifyApi.CurrentlyPlayingObject>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasDevice, setHasDevice] = useState(false);

  const initPlayer = async () => {
    const deviceRes = await _getDevices();
    switch (deviceRes.status) {
      case "no_active_device":
        const playbackRes = await _transferPlayback(deviceRes.id as string);
        if (playbackRes === "ok") {
          _getCurrentTrack();
        }
      case "ok":
        await _getCurrentTrack();
        break;
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      initPlayer();
    }
  }, [status]);

  // get available devices
  const _getDevices = () => {
    return new Promise<SpotifyProvderDeviceResponse>(
      async (resolve, reject) => {
        const res = await fetch(
          "https://api.spotify.com/v1/me/player/devices",
          {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
          }
        );
        const response: SpotifyApi.UserDevicesResponse = await res.json();
        // find eligible first device
        const device = response.devices.find(
          (dvc) => !dvc.is_private_session && !dvc.is_restricted
        );
        setHasDevice(!!device?.id);
        // if device isn't active, transfer playback to it
        if (!device?.id) {
          resolve({ status: "no_available_device" });
          return;
        }
        if (!device?.is_active) {
          // device must be active in order to pause/play the music from there
          resolve({ status: "no_active_device", id: device.id });
          await _transferPlayback(device.id);
        }
        resolve({ status: "ok", id: device.id });
        _getCurrentTrack();
      }
    );
  };

  // transfer playback to another device
  const _transferPlayback = (deviceId: string) => {
    return new Promise<"ok" | "error">(async (resolve, reject) => {
      const res = await fetch("https://api.spotify.com/v1/me/player", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          device_ids: [deviceId],
        }),
      });
      resolve(res.ok ? "ok" : "error");
    });
  };

  const _getCurrentTrack = async () => {
    const res = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      }
    );
    if (res.ok) {
      const response: SpotifyApi.CurrentlyPlayingObject = await res.json();
      setCurrentTrack(response);
      setIsPlaying(response.is_playing);
      setIsLoading(false);
    }
  };

  const values: SpotifyProverProps = {
    currentTrack,
    isLoading,
    setIsLoading,
    hasDevice,
    initPlayer,
    isPlaying,
    setIsPlaying,
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
