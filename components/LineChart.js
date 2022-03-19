// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { getRelativePosition } from "chart.js/helpers";
import { useEffect, useRef } from "react";
import { useRecoilState } from "recoil";
import { videoCurrentTimeState, videoTimeState } from "../atoms/VideoStateAtom";
import moment from "moment";
import "chartjs-adapter-moment";

function LineChart({
  videoName,
  color,
  duration,
  videoAnalytics,
  numVideos,
  absoluteTime,
}) {
  // --- VARS ---
  const canvasEl = useRef(null);
  const [videoCurrentTime, setVideoCurrentTime] = useRecoilState(
    videoCurrentTimeState
  );
  const [videoTime, setVideoTime] = useRecoilState(videoTimeState);
  // -------------------------------------------------------

  // --- Function for get the time (format) from seconds ---
  function convertHMSrString(time) {
    const sec = parseInt(time, 10);
    let hours = Math.floor(sec / 3600); // get hours
    let minutes = Math.floor((sec - hours * 3600) / 60); // get minutes
    let seconds = sec - hours * 3600 - minutes * 60; //  get seconds
    // add 0 if value < 10; Example: 2 => 02
    if (hours < 10) {
      hours = "0" + hours;
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    if (seconds < 10) {
      seconds = "0" + seconds;
    }

    return `${hours > 0 ? `${hours}:` : ""}${minutes}:${seconds}`;
    // return {
    //   hours: hours,
    //   minutes: minutes,
    //   seconds: seconds,
    // };
  }
  // ----------------------------------

  // --- Set the X values for chart ---
  let half_time = 0;
  let full_time = 0;
  let duration_1 = 0;
  let duration_2 = 0;

  if (numVideos === 1) {
    half_time = convertHMSrString(videoTime / 2);
    full_time = convertHMSrString(videoTime);
  } else {
    duration_1 = moment.duration(duration[0]).asSeconds();
    duration_2 = moment.duration(duration[1]).asSeconds();

    if (duration_1 > duration_2) {
      half_time = convertHMSrString(duration_1 / 2);
      full_time = convertHMSrString(duration_1);
    } else {
      half_time = convertHMSrString(duration_2 / 2);
      full_time = convertHMSrString(duration_2);
    }
  }

  console.log({ half_time });
  console.log({ full_time });
  // -------------------------------

  // --- Calculate values and params ---
  let matriz = [];
  let matriz_2 = [];

  // console.log({videoAnalytics});

  if (numVideos === 1) {
    // Matriz video:
    matriz.push({
      x: 0,
      y: videoAnalytics[0][1] >= 1 ? 100 : videoAnalytics[0][1] * 100,
      percentage: "0%",
    });
    let t_video = videoTime / 100;
    let l = t_video;
    let row = 0;
    for (let index = 1; index < videoTime; index++) {
      if (index <= l) {
        matriz.push({
          x: l,
          y: videoAnalytics[row][1] >= 1 ? 100 : videoAnalytics[row][1] * 100,
          percentage: `${row}%`,
        });
      } else {
        l = l + t_video;
        row++;
        matriz.push({
          x: l,
          y: videoAnalytics[row][1] >= 1 ? 100 : videoAnalytics[row][1] * 100,
          percentage: `${row}%`,
        });
      }
    }
  } else {
    // Matriz video 1:
    matriz.push({
      x: 0,
      y: videoAnalytics[0][0][1] >= 1 ? 100 : videoAnalytics[0][0][1] * 100,
      percentage: "0%",
    });
    let t_video = duration_1 / 100;
    let l = t_video;
    let row = 0;
    for (let index = 1; index < duration_1; index++) {
      if (index <= l) {
        matriz.push({
          x: l,
          y:
            videoAnalytics[0][row][1] >= 1
              ? 100
              : videoAnalytics[0][row][1] * 100,
          percentage: `${row}%`,
        });
      } else {
        l = l + t_video;
        row++;
        matriz.push({
          x: l,
          y:
            videoAnalytics[0][row][1] >= 1
              ? 100
              : videoAnalytics[0][row][1] * 100,
          percentage: `${row}%`,
        });
      }
    }
    // Matriz video 2:
    matriz_2.push({
      x: 0,
      y: videoAnalytics[1][0][1] >= 1 ? 100 : videoAnalytics[1][0][1] * 100,
      percentage: "0%",
    });
    t_video = duration_2 / 100;
    l = t_video;
    row = 0;
    for (let index = 1; index < duration_2; index++) {
      if (index <= l) {
        matriz_2.push({
          x: l,
          y:
            videoAnalytics[1][row][1] >= 1
              ? 100
              : videoAnalytics[1][row][1] * 100,
          percentage: `${row}%`,
        });
      } else {
        l = l + t_video;
        row++;
        matriz_2.push({
          x: l,
          y:
            videoAnalytics[1][row][1] >= 1
              ? 100
              : videoAnalytics[1][row][1] * 100,
          percentage: `${row}%`,
        });
      }
    }
  }

  console.log({ matriz });
  console.log({ matriz_2 });
  // -------------------------------------

  // --- CREATE THE GAPHICS AND INSERT ---
  useEffect(() => {
    // const ctx = canvasEl.current.getContext("2d");
    const ctx = document.getElementById("myChart");

    console.log({ absoluteTime });

    // if (numVideos === 1) {
    //   if (absoluteTime === true) {
    //     console.log("HOLA");
    //     matriz.map((m)=> (
    //       console.log(m)
    //     ))
    //   }else {
    //     Array.from(Array(videoTime).keys())
    //   }
    // }else {
    //   if (absoluteTime === true) {
    //     matriz.map((m)=> (
    //       console.log(m.percentage)
    //     ))
    //   }else {
    //     Array.from(Array(videoTime).keys())
    //   }
    // }

    const labels =
      numVideos === 1
        ? Array.from(Array(videoTime).keys())
        : duration_1 > duration_2
        ? Array.from(Array(duration_1).keys())
        : Array.from(Array(duration_2).keys());

    const data = {
      labels: labels,
      datasets:
        numVideos === 1
          ? [
              {
                label: videoName,
                borderColor: color,
                backgroundColor: color,
                borderWidth: 2,
                tension: 0.3,
                data: matriz.map((value) => ({
                  x: value.x,
                  y: value.y,
                })),
                pointRadius: 1,
              },
            ]
          : [
              {
                label: videoName[0],
                borderColor: color[0],
                backgroundColor: color[0],
                tension: 0.3,
                data: matriz.map((value) => ({
                  x: value.x,
                  y: value.y,
                })),
              },
              {
                label: videoName[1],
                borderColor: color[1],
                backgroundColor: color[1],
                tension: 0.3,
                data: matriz_2.map((value) => ({
                  x: value.x,
                  y: value.y,
                })),
              },
            ],
    };

    console.log({ data });

    // const config = {
    //   type: "line",
    //   data: data
    // };

    const config = {
      type: "line",
      data: data,
      options: {
        plugins: {
          title: {
            display: true,
            text:
              numVideos === 1 ? videoName : `${videoName[0]} | ${videoName[1]}`,
          },
        },
        scales: {
          // x: {
          //   type: "time",
          //   time: {
          //     unit: 'second',
          //     displayFormats: {
          //       quarter: "mm:ss",
          //     },
          //   },
          //   title: {
          //     display: true,
          //     text: "Time",
          //   },
          // },
          y: {
            // display: false,
            title: {
              display: true,
              text: "Percentage (%)",
            },
          },
        },
      },
    };
    const myLineChart = new Chart(ctx, config);

    return function cleanup() {
      myLineChart.destroy();
    };
  });

  // ChartJS.register(
  //   CategoryScale,
  //   LinearScale,
  //   PointElement,
  //   LineElement,
  //   Title,
  //   Tooltip,
  //   Legend
  // );

  // const labels = [, half_time, full_time];
  // const options = {
  //   spanGaps: false,
  //   responsive: true,
  //   interaction: {
  //     mode: "index",
  //     intersect: false,
  //   },
  //   stacked: true,
  //   plugins: {
  //     title: {
  //       display: true,
  //       text: numVideos === 1 ? videoName : `${videoName[0]} | ${videoName[1]}`,
  //     },
  //   },
  //   scales: {
  //     x: {
  //       type: "time",
  //       time: {
  //         unit: "second",
  //       },
  //     },
  //     y: {
  //       min: 0,
  //       max: 100,
  //       type: "linear",
  //       display: true,
  //       position: "right",
  //       ticks: {
  //         stepSize: 33,
  //       },
  //     },
  //   },
  // };
  // const data = {
  //   labels,
  //   datasets:
  //     numVideos === 1
  //       ? [
  //           {
  //             label: videoName,
  //             data: ["50", "20", "10", "40", "20", "30", "20"],
  //             borderColor: color,
  //             backgroundColor: color,
  //             // yAxisID: "y",
  //             tension: 0.2,
  //           },
  //         ]
  //       : [
  //           {
  //             label: videoName[0],
  //             borderColor: color[0],
  //             backgroundColor: color[0],
  //             yAxisID: "y",
  //             tension: 0.2,
  //             data: matriz.map((value) => ({
  //               x: value.x,
  //               y: value.y,
  //             })),
  //           },
  //           {
  //             label: videoName[1],
  //             borderColor: color[1],
  //             backgroundColor: color[1],
  //             yAxisID: "y",
  //             tension: 0.2,
  //             data: matriz_2.map((value) => ({
  //               x: value.x,
  //               y: value.y,
  //             })),
  //           },
  //         ],
  // };

  return (
    <div>
      {/* <Line options={options} data={data} /> */}
      <canvas id="myChart" ref={canvasEl} height="100" />
    </div>
  );
}

export default LineChart;
