import { useState, useEffect } from "react";
import Video from "./Video";

const bg_colors = [
  "bg-red-400",
  "bg-cyan-400",
  "bg-yellow-400",
  "bg-violet-400",
];

function SelectVideo({ videos }) {
  const [videoSelected, setVideoSelected] = useState(1);
  const [iframe, setIframe] = useState(videos.videos[1].items[0].player.embedHtml)

  useEffect(() => {
    setIframe(videos.videos[videoSelected].items[0].player.embedHtml)
  }, [videoSelected]);

  console.log({videoSelected});
  console.log({iframe});
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
  console.log(videos);

  let select_video = [];
  for (let index = 0; index < videos.num; index++) {
    const info = videos.videos[index + 1].items[0];
    console.log(info);
    const id = info.id;
    const title = info.snippet.title;
    const duration = info.contentDetails.duration;
    const thumb = info.snippet.thumbnails.default.url;
    const { hours, minutes, seconds } = convertISO8601ToValues(duration);

    select_video.push(
      <div
        onClick={() => setVideoSelected(index+1)}
        key={id}
        className={`${(videoSelected === index+1) ? 'bg-gray-300': 'bg-gray-100'} bg-gray-100 flex items-center justify-between py-2 px-3 gap-3 rounded mt-2 w-full cursor-pointer`}
      >
        <img className="rounded w-16 h-auto" src={thumb} alt="title" />
        <p className="text-black text-sm">{title}</p>
        <p className={`${bg_colors[index]} px-3 py-1 rounded text-sm`}>
          {minutes}:{seconds}
        </p>
      </div>
    );
  }


  return (
    <div className="py-24 flex px-10 justify-center items-center gap-20">
      <div className="flex-1">
        <h2 className="text-3xl">Select Video</h2>
        {select_video}
      </div>
      <div className="flex-1">
        <Video 
          src={`https://www.youtube.com/watch?v=${videos.videos[videoSelected].items[0].id}`}
          color={bg_colors[videoSelected-1]} />
      </div>
    </div>
  );
}

export default SelectVideo;
