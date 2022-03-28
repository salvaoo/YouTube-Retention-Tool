import { useRef, useState, useEffect } from "react";
import {
  IoPlayBackOutline,
  IoPlayForwardOutline,
  IoPlayOutline,
  IoPauseOutline,
} from "react-icons/io5";
import ReactPlayer from "react-player";
import {
  videoCurrentTimeState,
  videoTimeState,
  lineTimeChartState,
  playingState,
} from "../atoms/videoStateAtom";
import { useRecoilState } from "recoil";

function Video({ src, color }) {
  const videoRef = useRef(null);
  const [currentTime, setCurrentTime] = useRecoilState(videoCurrentTimeState);
  const [videoTime, setVideoTime] = useRecoilState(videoTimeState);
  const [lineTimeChart, setLineTimeChart] = useRecoilState(lineTimeChartState);
  const [playing, setPlaying] = useRecoilState(playingState);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    console.log({ videoTime });
    console.log(videoRef);
    console.log({ playing })
  });

  useEffect(() => {
    videoRef.current.seekTo(lineTimeChart);
  }, [lineTimeChart]);

  useEffect(() => {
    if (playing) {
      const move = setInterval(() => {
        let realTime = videoRef
          ? videoRef.current.getCurrentTime()
          : currentTime;
        setCurrentTime(realTime);
        setProgress((videoRef.current.getCurrentTime() / videoTime) * 100);
      }, 100);

      return () => {
        clearInterval(move);
      };
    }
  }, [playing]);

  const videoHandler = (control) => {
    console.log({ control });

    if (control === "play") {
      setPlaying(true);
      var vid = videoRef.current.getDuration();
      setVideoTime(vid);
    } else if (control === "pause") {
      setPlaying(false);
    }
  };

  const fastForward = () => {
    let realTime = videoRef
          ? videoRef.current.getCurrentTime()
          : currentTime;
    videoRef.current.seekTo(realTime + 5);
    // videoRef.current.currentTime += 5;
  };

  const revert = () => {
    let realTime = videoRef
          ? videoRef.current.getCurrentTime()
          : currentTime;
    videoRef.current.seekTo(realTime - 5);
    // videoRef.current.currentTime -= 5;
  };

  return (
    <div className="flex flex-col overflow-hidden w-full h-full relative bg-red-200 rounded">
      {/* <video
        id="video1"
        ref={videoRef}
        className="video"
        src={`https://www.youtube.com/watch?v=${src}`}
      ></video> */}
      <ReactPlayer
        ref={videoRef}
        url={`https://www.youtube.com/watch?v=${src}`}
        width="100%"
        controls={false}
        loop={false}
        playing={playing}
        onReady={videoHandler}
        // style={{ pointerEvents: "none" }}
      />
      <div className="controlsContainer">
        <div className="controls">
          <IoPlayBackOutline onClick={revert} className="controlsIcon" />

          {playing ? (
            <IoPauseOutline
              onClick={() => videoHandler("pause")}
              className="controlsIcon--small"
            />
          ) : (
            <IoPlayOutline
              onClick={() => videoHandler("play")}
              className="controlsIcon--small"
            />
          )}

          <IoPlayForwardOutline
            onClick={fastForward}
            className="controlsIcon"
          />
        </div>
      </div>
      <div className="timecontrols">
        <p className="controlsTime">
          {Math.floor(currentTime / 60) +
            ":" +
            ("0" + Math.floor(currentTime % 60)).slice(-2)}
        </p>
        <div className="time_progressbarContainer">
          <div
            style={{ width: `${progress}%` }}
            className={`time_progressBar ${color}`}
          ></div>
        </div>
        <p className="controlsTime">
          {Math.floor(videoTime / 60) +
            ":" +
            ("0" + Math.floor(videoTime % 60)).slice(-2)}
        </p>
      </div>
    </div>
  );
}

export default Video;
