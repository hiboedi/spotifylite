import React, { useEffect, useState } from "react";
import useSpotify from "./useSpotify";
import { useRecoilState } from "recoil";
import { currentIdTrackState } from "../atoms/SongAtom";

function useSongInfo() {
  const spotifyApi = useSpotify();
  const [currentIdTrack, setCurrentIdTrack] =
    useRecoilState(currentIdTrackState);
  const [songInfo, setSongInfo] = useState(null);

  useEffect(() => {
    const fetchSongInfo = async () => {
      if (currentIdTrack) {
        const trackInfo = await fetch(
          `https://api.spotify.com/v1/tracks/${currentIdTrack}`,
          {
            headers: {
              Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
            },
          }
        ).then((res) => res.json());

        setSongInfo(trackInfo);
      }
    };
    fetchSongInfo();
  }, [currentIdTrack, spotifyApi]);

  return songInfo;
}

export default useSongInfo;
