import { useRef, useState, useEffect } from "react";
import {
  IoPlayBackOutline,
  IoPlayForwardOutline,
  IoPlayOutline,
  IoPauseOutline
} from "react-icons/io5";

function Video({ src, color }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoTime, setVideoTime] = useState(0);
  const [progress, setProgress] = useState(0);

  const videoHandler = (control) => {
    if (control === "play") {
      videoRef.current.play();
      setPlaying(true);
      var vid = document.getElementById("video1");
      setVideoTime(vid.duration);
    } else if (control === "pause") {
      videoRef.current.pause();
      setPlaying(false);
    }
  };

  const fastForward = () => {
    videoRef.current.currentTime += 5;
  };

  const revert = () => {
    videoRef.current.currentTime -= 5;
  };

  window.setInterval(function () {
    setCurrentTime(videoRef.current?.currentTime);
    setProgress((videoRef.current?.currentTime / videoTime) * 100);
  }, 1000);

  return (
    <div className="flex flex-col overflow-hidden w-full h-full relative bg-red-200 rounded">
      <video 
        id="video1" 
        ref={videoRef} 
        className="video" 
        src={`/PBM_outro.mp4`}></video>
      <div className="controlsContainer">
        <div className="controls">
          <IoPlayBackOutline onClick={revert} className="controlsIcon" />

          {playing ? (
            <IoPauseOutline onClick={() => videoHandler("pause")} className="controlsIcon--small" />
          ) : (
            <IoPlayOutline onClick={() => videoHandler("play")} className="controlsIcon--small" />
          )}

          <IoPlayForwardOutline onClick={fastForward} className="controlsIcon" />
        </div>
      </div>
      <div className="timecontrols">
        <p className="controlsTime">    
          {Math.floor(currentTime / 60) + ":" + ("0" + Math.floor(currentTime % 60)).slice(-2)}
        </p>
        <div className="time_progressbarContainer">
          <div style={{ width: `${progress}%` }} className={`time_progressBar ${color}`}></div>
        </div>
        <p className="controlsTime">
          {Math.floor(videoTime / 60) + ":" + ("0" + Math.floor(videoTime % 60)).slice(-2)}
        </p>
      </div>
    </div>
  );
}

export default Video;
