"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useGlobalAudioPlayer } from "react-use-audio-player";
import trackMap from "@/utils/trackMap";

declare type ControlProps = {
  isShow: boolean;
  setIsShow: React.Dispatch<React.SetStateAction<boolean>>;
  isAutoChange: boolean;
  setIsAutoChange: React.Dispatch<React.SetStateAction<boolean>>;
};

const ControlContext = createContext<ControlProps>({
  isShow: true,
  setIsShow: () => {},
  isAutoChange: false,
  setIsAutoChange: () => {},
});

const ControlProvider = ({ children }: { children: React.ReactNode }) => {
  const [isShow, setIsShow] = useState(true);
  const [isAutoChange, setIsAutoChange] = useState(true);

  const value = {
    isShow,
    setIsShow,
    isAutoChange,
    setIsAutoChange,
  };

  return (
    <>
      <ControlContext.Provider value={value}>
        {children}
      </ControlContext.Provider>
    </>
  );
};

export default ControlProvider;

export const useControl = () => {
  const player = useContext(ControlContext);
  return player;
};
