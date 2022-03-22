import { useState, useEffect } from "react";
import Notification from "./Notification";
import { useRecoilState } from "recoil";
import { notificationState } from "../atoms/notificationAtom";

function SearchVideo() {

  const [loading, setLoading] = useState(false);
  const [sVideos, setSVideos] = useState()
  const [notification, setNotification] = useRecoilState(notificationState);

  useEffect(() => {
    console.log({sVideos});
  }, [sVideos])

  const searchVideos = async (event) => {
    event.preventDefault();

    setLoading(true);

    const q = event.target.qsearch.value

    // const url = `/api/youtube/video?id=${inputs[1]}${
    //   numVideo === 2 ? `&id2=${inputs[2]}` : ""
    // }`;
    const url = `/api/youtube/search?q=${q}`;

    const res_search = await fetch(url).then((res) => res.json());

    // console.log({res_search});

    if (res_search.result.search.error) {
      setLoading(false);
      setNotification(
        <ul className="fixed top-0 left-0 flex flex-col list-none	justify-end p-5">
          <Notification
            code={res_search.result.search.error.code}
            message={res_search.result.search.error.errors[0].message}
            reason={res_search.result.search.error.errors[0].reason}
            recommended={``}
          />
        </ul>
      )
    }else {
      setLoading(false);
      if (res_search.result.search.items.length === 0) {
        setNotification(
          <ul className="fixed top-0 left-0 flex flex-col list-none	justify-end p-5 w-4/12">
            <Notification
              code={404}
              message={`Sorry, we can't find items`}
              reason={`0 videos`}
              recommended={`Try search different video, please remember you only can use videos from your own channel`}
            />
          </ul>
        )
      }else {
        setSVideos(res_search.result.search.items);
      }
    }
  };




  return (
    <div>
      <form onSubmit={searchVideos}>
        <div className='flex items-center justify-center p-5 gap-3 rounded-2xl w-fit m-auto mt-2'>
          {/* <label htmlFor="qsearch">search: </label> */}
          <input className="px-2 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus-visible:border-0 focus-visible:ring-2 focus-visible:ring-red-300 transition-all w-64" id='qsearch' name='qsearch' autoComplete='q' type="text" placeholder="Search in your channel.." required />
        </div>
          {/* <button
            className="font-bold bg-black text-white px-8 py-2 rounded-lg hover:scale-105 transition-all duration-200 mt-5"
            type="submit"
          >
            {loading ? (
              <AiOutlineLoading3Quarters className="animate-spin m-auto w-6 h-6" />
            ) : (
              "Search in your channel"
            )}
          </button> */}
        </form>
    </div>
  )
}

export default SearchVideo