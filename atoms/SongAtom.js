import { atom } from "recoil";

export const currentIdTrackState = atom({
  key: "currentIdTrackState", // unique ID respect to other atom or selector
  default: null,
});

export const isPlayingState = atom({
  key: "isPlayingState",
  default: false,
});
