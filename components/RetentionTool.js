import { useState, useEffect } from "react";
import LineChart from "./LineChart";
import Video_iframe from "./Video_iframe";
import { Switch } from "@headlessui/react";
import { useRecoilState } from "recoil";
import {
  videoCurrentTimeState,
} from "../atoms/videoStateAtom";

const bg_colors = ["bg-red-400", "bg-cyan-400"];
const bg_colors_rgb = ["rgb(248 113 113)", "rgb(34 211 238)"];

function RetentionTool({ videos }) {
  const [videoSelected, setVideoSelected] = useState(1);
  const [enabledSW, setEnabledSW] = useState(false);
  const [videoCurrentTime, setVideoCurrentTime] = useRecoilState(
    videoCurrentTimeState);

  useEffect(() => {
    setVideoCurrentTime(0)
  }, [videoSelected])

  const convertISO8601ToValues = (input) => {
    var reptms = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
    var hours = 0,
      minutes = 0,
      seconds = 0;

    if (reptms.test(input)) {
      var matches = reptms.exec(input);
      if (matches[1]) hours = Number(matches[1]);
      if (matches[2]) minutes = Number(matches[2]);
      if (matches[3]) seconds = Number(matches[3]);
    }

    return {
      hours: hours,
      minutes: minutes,
      seconds: seconds,
    };
  };

  // console.log({ videos });
  // console.log({ videoSelected });

  let select_video = [];
  for (let index = 0; index < videos.num; index++) {
    const info = videos.videos[index + 1].items[0];
    const id = info.id;
    const title = info.snippet.title;
    const duration = info.contentDetails.duration;
    const thumb = info.snippet.thumbnails.default.url;
    const { hours, minutes, seconds } = convertISO8601ToValues(duration);

    select_video.push(
      <div
        onClick={() => setVideoSelected(index + 1)}
        key={id}
        className={`${
          videoSelected === index + 1 ? "bg-gray-300" : "bg-gray-100"
        } flex items-center justify-between py-2 px-3 gap-3 rounded mt-2 w-full cursor-pointer`}
      >
        <img className="rounded w-16 h-auto" src={thumb} alt="title" />
        <p className="text-black text-sm">{title}</p>
        <p className={`${bg_colors[index]} px-3 py-1 rounded text-sm`}>
          {hours > 0 ? `${hours}:` : ''}{minutes}:{seconds}
        </p>
      </div>
    );
  }

  return (
    <div className="m-auto py-24 px-16 relative">
      {/* SELECT VIDEO */}
      <div className="flex justify-center items-center gap-20">
        <div className="flex-1">
          <h2 className="text-3xl">Select Video</h2>
          {select_video}
        </div>
        <div className="flex-1">
          {/* <Video 
          src={`https://www.youtube.com/watch?v=${videos.videos[videoSelected].items[0].id}`}
          color={bg_colors[videoSelected-1]} 
        /> */}
          <Video_iframe
            src={`${videos.videos[videoSelected].items[0].id}`}
            color={bg_colors[videoSelected - 1]}
          />
        </div>
      </div>
      {/* LINE CHART */}
      <div className="flex items-center justify-evenly">
        <div className="text-center space-y-3">
          <Switch
            checked={enabledSW}
            onChange={setEnabledSW}
            className={`${enabledSW ? "bg-black" : "bg-black"}
          relative inline-flex flex-shrink-0 h-[34px] w-[70px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
          >
            <span className="sr-only">Use setting</span>
            <span
              aria-hidden="true"
              className={`${enabledSW ? "translate-x-9" : "translate-x-0"}
            pointer-events-none inline-block h-[30px] w-[30px] rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
            />
          </Switch>
          
          <p><span className={`${!enabledSW ? 'font-bold' : 'text-gray-400'} transition ease-in-out duration-200`}>Absolute Time Elapse</span> | <span className={`${enabledSW ? 'font-bold' : 'text-gray-400'} transition ease-in-out duration-200`}>Elapse Time Porcentage</span></p>
        </div>
        <div className="pt-10 w-8/12">
          <LineChart
            videoName={
              videos.num === 1
                ? videos.videos[videoSelected].items[0].snippet.title
                : [
                    videos.videos[1].items[0].snippet.title,
                    videos.videos[2].items[0].snippet.title,
                  ]
            }
            color={
              videos.num === 1
                ? bg_colors_rgb[videoSelected - 1]
                : [bg_colors_rgb[0], bg_colors_rgb[1]]
            }
            duration={
              videos.num === 1
                ? videos.videos[videoSelected].items[0].contentDetails.duration
                : [
                  videos.videos[1].items[0].contentDetails.duration,
                  videos.videos[2].items[0].contentDetails.duration
                ]
            }
            videoAnalytics={
              videos.num === 1
              ? videos.videos_analytics[videoSelected].rows
              : [
                videos.videos_analytics[1].rows,
                videos.videos_analytics[2].rows,
              ]
            }
            numVideos={videos.num}
            videoSelected={videoSelected}
            absoluteTime={!enabledSW}
          />
        </div>
      </div>
    </div>
  );
}

export default RetentionTool;
