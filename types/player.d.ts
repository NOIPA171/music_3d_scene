declare type songItem = {
  song_name: string;
  source: string;
  environment: string;
};

declare type PlayerProps = {
  currentTrackIdx: number;
  // setCurrentTrackIdx: React.Dispatch<React.SetStateAction<number>>;
  songList: songItem[];
  currentTrack: songItem;
  loadSong: Function<void>;
  isReady: boolean;
  playing: boolean;
  duration: number;
};
