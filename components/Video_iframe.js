import { useEffect, useState, useRef } from "react";
import YouTube from "react-youtube";
import { useRecoilState } from "recoil";
import {
  videoCurrentTimeState,
  videoTimeState,
  lineTimeChartState,
  playingState
} from "../atoms/videoStateAtom";

function Video_iframe({ src, color }) {
  const videoRef = useRef(null);
  const [videoCurrentTime, setVideoCurrentTime] = useRecoilState(
    videoCurrentTimeState
  );
  const [videoTime, setVideoTime] = useRecoilState(videoTimeState);
  const [lineTimeChart, setLineTimeChart] = useRecoilState(lineTimeChartState);
  const [playing, setPlaying] = useRecoilState(playingState);
  const [player, setPlayer] = useState();

  useEffect(() => {
    player?.seekTo(lineTimeChart);
  }, [lineTimeChart]);

  useEffect(() => {
    if (playing) {
      const move = setInterval(() => {
        let realTime = player ? player?.getCurrentTime() : videoCurrentTime;
        setVideoCurrentTime(realTime)
      }, 100);
      return () => {
        clearInterval(move);
      };
    }
  }, [playing]);

  const opts = {
    height: "440",
    width: "720",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
    },
  };

  // --- PLAYER FUNCTIONS ---
  const videoReady = (e) => {
    setVideoTime(e.target.getDuration());
    setPlayer(e.target);
    setLineTimeChart(0)
  };

  const videoStateChange = (event) => {
    let currentTime = event.target.playerInfo.currentTime;
    setVideoCurrentTime(currentTime);

    let sw = playing;
    if (event.data == 1) {
      sw = true;
    } else if (event.data == 2) {
      sw = false;
    }

    setPlaying(sw);
  };
  // --------------------------------------

  return (
    <div>
      <YouTube
        id="player"
        ref={videoRef}
        className="rounded"
        videoId={src}
        opts={opts}
        onReady={videoReady}
        onStateChange={videoStateChange}
      />
    </div>
  );
}

export default Video_iframe;
