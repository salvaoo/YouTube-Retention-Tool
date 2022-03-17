import React from "react";

const bg_colors = [
  "bg-red-400",
  "bg-cyan-400",
  "bg-yellow-400",
  "bg-violet-400",
]

function Input_video({ num }) {
  let inputs = [];
  for (let index = 0; index < num; index++) {
    inputs.push(
      <div key={index} className={`${bg_colors[index]} flex items-center justify-center p-5 gap-3 rounded-2xl w-fit m-auto mt-2`}>
        <label htmlFor="video_link">video {index+1}:</label>
        <input className="px-2 py-1 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 transition-all w-64" id={`video_link_${index+1}`} name={`video_link_${index+1}`} autoComplete={`video_link_${index+1}`} type="text" placeholder="insert URL video.." required />
      </div>
    )
  }

  return inputs
}

export default Input_video;
