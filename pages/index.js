import Head from "../components/Head_template";
import { getSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Input_video from "../components/Input_video";
import { HiPlus } from "react-icons/hi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import User from "../components/User";
import React from "react";
import SelectVideo from "../components/SelectVideo";


export default function Home({ session }) {
  const [numVideo, setNumVideo] = useState(1);
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState();

  useEffect(() => {
    const button = document.querySelectorAll("button");
    button.forEach(function (b) {
      b.disabled = loading;
    });
  }, [loading]);

  const searchVideo = async (event) => {
    event.preventDefault();

    setLoading(true);

    let inputs = {};
    if (numVideo === 2) {
      inputs = {
        1: event.target.video_link_1.value.split("/")[3],
        2: event.target.video_link_2.value.split("/")[3],
      };
    } else {
      inputs = {
        1: event.target.video_link_1.value.split("/")[3],
      };
    }

    const url = `/api/youtube/video?id=${inputs[1]}${
      numVideo === 2 ? `&id2=${inputs[2]}` : ""
    }`;
    const res = await fetch(url).then((res) => res.json());

    setVideos(res);
    setLoading(false);
  };

  return (
    <div className="relative">
      <Head
        title="YouTube Retention Tool"
        description_content="YouTube Retention Tool app"
        icon="/youicon.ico"
      />

      <User />

      <main className={`${videos ? 'hidden' : ''} text-center py-10 h-screen`}>
        <h1 className="text-4xl font-bold">YouTube Retention Tool</h1>
        <h3 className="text-xl my-4">Add your video links here:</h3>

        {/* loading effect */}
        {/* <div class="shadow border border-slate rounded-2xl max-w-xs w-full mx-auto">
          <div class="animate-pulse flex items-center justify-center p-5 gap-3 rounded-2x m-auto mt-2">
            <div class="rounded bg-slate-300 h-5 w-20"></div>
            <div class="flex-1 space-y-6 py-1">
              <div class="h-8 bg-slate-3s00 rounded"></div>
            </div>
          </div>
        </div> */}

        {/* onSubmit={searchVideo}  */}
        <form onSubmit={searchVideo}>
          <Input_video num={numVideo} />
          <button
            className="font-bold bg-black text-white px-8 py-2 rounded-lg hover:scale-105 transition-all duration-200 mt-5"
            type="submit"
          >
            {loading ? (
              <AiOutlineLoading3Quarters className="animate-spin m-auto w-6 h-6" />
            ) : (
              "CREATE TOOL"
            )}
          </button>
        </form>
        <div className="mt-5 absolute bottom-5 right-5 group transition-all duration-300 hover:scale-105">
          <button
            className="font-bold text-white bg-black p-3 rounded-lg mt-5 flex items-center gap-2"
            onClick={() => numVideo < 2 && setNumVideo(numVideo + 1)}
          >
            <HiPlus className="w-6 h-6" />
            <span className="">Add video</span>
          </button>
        </div>
      </main>

      {/* CONTENT */}
      {videos ? <SelectVideo videos={videos} /> : ''}

    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}
