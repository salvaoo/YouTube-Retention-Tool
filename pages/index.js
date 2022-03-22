import Head from "../components/Head_template";
import { getSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Input_video from "../components/Input_video";
import { HiPlus } from "react-icons/hi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import User from "../components/User";
import React from "react";
import RetentionTool from "../components/RetentionTool";
import Notification from "../components/Notification"
import { useRecoilState } from "recoil";
import { notificationState } from "../atoms/notificationAtom";
import Footer from "../components/Footer";
import SearchVideo from "../components/SearchVideo";

export default function Home({ session }) {

  const [numVideo, setNumVideo] = useState(1);
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState();
  const [notification, setNotification] = useRecoilState(notificationState);

  useEffect(() => {
    const button = document.querySelectorAll("button");
    button.forEach(function (b) {
      b.disabled = loading;
    });
  }, [loading]);

  const sendVideos = async (event) => {
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

    // const url = `/api/youtube/video?id=${inputs[1]}${
    //   numVideo === 2 ? `&id2=${inputs[2]}` : ""
    // }`;
    const url = `/api/youtube/analytics?id=${inputs[1]}${
      numVideo === 2 ? `&id2=${inputs[2]}` : ""
    }`;

    const res = await fetch(url).then((res) => res.json());

    console.log({res});
    
    if (res.videos_analytics[1].error) {
      setLoading(false);
      setNotification(
        <ul className="fixed top-0 left-0 flex flex-col list-none	justify-end p-5">
          <Notification
            code={res.videos_analytics[1].error.code}
            message={res.videos_analytics[1].error.errors[0].message}
            reason={res.videos_analytics[1].error.errors[0].reason}
            recommended={`Log out and log in again`}
          />
        </ul>
      )
    }else {
      setLoading(false);
      if (res.videos_analytics[1].rows.length === 0) {
        setNotification(
          <ul className="fixed top-0 left-0 flex flex-col list-none	justify-end p-5 w-4/12">
            <Notification
              code={404}
              message={`Sorry, something is wrong in your request`}
              reason={`errorID`}
              recommended={`Try another YouTube video, please remember you only can use videos from your own channel`}
            />
          </ul>
        )
      }else {
        setVideos(res);
      }
    }
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

        <form onSubmit={sendVideos}>
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

        <SearchVideo />
      </main>

      {/* CONTENT */}
      {videos ? <RetentionTool videos={videos} /> : ''}

      {notification ? notification : ''}

      {videos ? <Footer /> : ''}
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




// curl \
//   'https://youtube.googleapis.com/youtube/v3/search?part=snippet&forMine=true&key=AIzaSyBlkQVlN2VjTBTI1YuluGB4YY6DhKwEVhI' \
//   --header 'Authorization: Bearer ya29.A0ARrdaM8MVRtF_H3TF5JmccbTpdKesrbiKnEwTchRwtE-OhYpI3W7a9Ke_3SbF2E9Vj2DzXRLZKFu9AsGZ8LgSsJS_wbntIlzUL-fVFE67xvBE0EhnHv1riYUswsbQWvg1RV6qoI3gzMOu2j3V-ATCuReJq3v' \
//   --header 'Accept: application/json' \
//   --compressed