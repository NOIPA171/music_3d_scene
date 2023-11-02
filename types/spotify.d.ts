declare interface SpotifyProverProps {
  player?: Spotify.Player;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
