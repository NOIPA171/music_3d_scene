declare type trackData = {
  fog: {
    color: string;
    far: number;
  };
  ambienceColor: string;
  bgColor: string[];
  baseRock: {
    baseColor: string;
    topColor: string;
  };
};

declare type trackEnvironment = "hills" | "sea";

declare type songItem = {
  song_name: string;
  source: string;
  environment: trackEnvironment;
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
