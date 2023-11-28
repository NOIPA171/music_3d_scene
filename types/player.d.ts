declare type PlayerProps = {
  currentTrackIdx: number;
  setCurrentTrackIdx: React.Dispatch<React.SetStateAction<number>>;
  songList: {
    song_name: string;
    source: string;
    environment: string;
  }[];
  loadSong: Function<void>;
  isReady: boolean;
  playing: boolean;
  duration: number;
};
