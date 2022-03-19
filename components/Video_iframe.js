import YouTube from 'react-youtube';
import { useRecoilState } from "recoil";
import { videoCurrentTimeState, videoTimeState } from "../atoms/VideoStateAtom";

function Video_iframe({ src, color }) {
  const [videoCurrentTime, setVideoCurrentTime] = useRecoilState(videoCurrentTimeState);
  const [videoTime, setVideoTime] = useRecoilState(videoTimeState);

  console.log({videoTime});
  console.log({videoCurrentTime});

  const opts = {
    height: '360',
    width: '640',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    }
  }

  const videoReady = (e) => {
    console.log({e});
    setVideoTime(e.target.getDuration())
  }

  const videoStateChange = (e) => {
    let currentTime = e.target.playerInfo.currentTime;
    setVideoCurrentTime(currentTime);
    console.log('stateChange', e);
  }

  // _onReady(event) {
  //   // access to player in all event handlers via event.target
  //   event.target.pauseVideo();
  // }

  return <div>
    <YouTube 
      className="rounded"
      videoId={src}
      opts={opts}
      onReady={videoReady}
      onStateChange={videoStateChange}
    />
    {/* <iframe className="rounded" id="player" type="text/html" width="640" height="360"
  src={`http://www.youtube.com/embed/${src}`}
  frameborder="0"></iframe> */}
  </div>;
}

export default Video_iframe;
