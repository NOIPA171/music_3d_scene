declare type SpotifyProverProps = {
  currentTrack?: SpotifyApi.CurrentlyPlayingObject;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  hasDevice: boolean;
  initPlayer: Function;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
};

declare type SpotifyProvderDeviceResponse = {
  status: "no_available_device" | "no_active_device" | "ok";
  id?: string;
};
