import Chart from "chart.js/auto";
import { getRelativePosition } from "chart.js/helpers";
import { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import {
  videoCurrentTimeState,
  videoTimeState,
  lineTimeChartState,
} from "../atoms/videoStateAtom";
import moment from "moment";
import "chartjs-adapter-moment";

function LineChart({
  videoName,
  color,
  duration,
  videoAnalytics,
  numVideos,
  videoSelected,
  absoluteTime,
}) {
  // ------------
  // --- VARS ---
  // ------------
  const canvasEl = useRef(null);
  const [videoCurrentTime, setVideoCurrentTime] = useRecoilState(
    videoCurrentTimeState
  );
  const [videoTime, setVideoTime] = useRecoilState(videoTimeState);
  const [lineTimeChart, setLineTimeChart] = useRecoilState(lineTimeChartState);

  // -------------------------------------------------------
  // --- Function for get the time (format) from seconds ---
  // -------------------------------------------------------
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
  }

  // ----------------------------------------------------
  // --- Function for create a matriz with video time ---
  // ----------------------------------------------------
  const createMatriz = (matriz, v_analytics, v_time) => {
    // --- Create a 100% analytics matriz ---
    let analytics_percentage = [];
    let j = 0;
    for (let index = 1; index <= 100; index++) {
      let exist = true;
      const x = index / 100;
      if (v_analytics[j][0] === x) {
        analytics_percentage.push(v_analytics[j][1]);
      } else {
        analytics_percentage.push(0);
        exist = false;
      }
      if (j < v_analytics.length - 1) {
        if (exist) {
          j++;
        }
      }
    }

    let t_video = v_time / 100 < 1 ? 1 : v_time / 100;
    let l = t_video;
    let row = 0;
    for (let index = 0; index < v_time; index++) {
      if (index <= l) {
        matriz.push({
          x: l,
          y:
            analytics_percentage[row] >= 1
              ? 100
              : analytics_percentage[row] * 100,
          percentage: `${row}%`,
        });
      } else {
        l = l + t_video;
        row++;
        // if (row < v_analytics.length) {
        // }
        matriz.push({
          x: l,
          y:
            analytics_percentage[row] >= 1
              ? 100
              : analytics_percentage[row] * 100,
          percentage: `${row}%`,
        });
      }
    }

    return matriz;
  };

  // --- Function to create a matriz ---
  // const createMatriz = (matriz, v_analytics, v_time) => {
  //   // let t_video = v_time / 100;
  //   let t_video = v_time / v_analytics.length;
  //   let l = t_video;
  //   let row = 0;
  //   for (let index = 0; index < v_time; index++) {
  //     if (index <= l) {
  //       matriz.push({
  //         x: l,
  //         y: v_analytics[row][1] >= 1 ? 100 : v_analytics[row][1] * 100,
  //         percentage: `${row}%`,
  //       });
  //     } else {
  //       l = l + t_video;
  //       row++;
  //       // if (row < v_analytics.length) {
  //       // }
  //       matriz.push({
  //         x: l,
  //         y: v_analytics[row][1] >= 1 ? 100 : v_analytics[row][1] * 100,
  //         percentage: `${row}%`,
  //       });
  //     }
  //   }

  //   return matriz;
  // };

  // ----------------------------------
  // --- Set the X values for chart ---
  // ----------------------------------
  let half_time_string = 0;
  let half_time_seconds = 0;
  let full_time_string = 0;
  let full_time_seconds = 0;
  let duration_1 = 0;
  let duration_2 = 0;

  if (numVideos === 1) {
    half_time_string = convertHMSrString(videoTime / 2);
    full_time_string = convertHMSrString(videoTime);
    half_time_seconds = parseInt(videoTime / 2);
    full_time_seconds = parseInt(videoTime);
  } else {
    duration_1 = moment.duration(duration[0]).asSeconds();
    duration_2 = moment.duration(duration[1]).asSeconds();

    if (duration_1 > duration_2) {
      half_time_string = convertHMSrString(duration_1 / 2);
      full_time_string = convertHMSrString(duration_1);
      half_time_seconds = parseInt(duration_1 / 2);
      full_time_seconds = parseInt(duration_1);
    } else {
      half_time_string = convertHMSrString(duration_2 / 2);
      full_time_string = convertHMSrString(duration_2);
      half_time_seconds = parseInt(duration_2 / 2);
      full_time_seconds = parseInt(duration_2);
    }
  }

  // -----------------------------------
  // --- Calculate values and params ---
  // -----------------------------------
  let matriz = [];
  let matriz_2 = [];

  if (numVideos === 1) {
    // Matriz video:
    matriz = createMatriz(matriz, videoAnalytics, videoTime);
  } else {
    // Matriz video 1:
    matriz = createMatriz(matriz, videoAnalytics[0], duration_1);
    // Matriz video 2:
    matriz_2 = createMatriz(matriz_2, videoAnalytics[1], duration_2);
  }

  // ----------------------
  // --- Custom Tooltip ---
  // ----------------------
  const getOrCreateTooltip = (chart) => {
    let tooltipEl = chart.canvas.parentNode.querySelector("div");

    if (!tooltipEl) {
      tooltipEl = document.createElement("div");
      tooltipEl.style.background = "rgba(0, 0, 0, 0.7)";
      tooltipEl.style.borderRadius = "3px";
      tooltipEl.style.color = "white";
      tooltipEl.style.opacity = 1;
      tooltipEl.style.pointerEvents = "none";
      tooltipEl.style.position = "absolute";
      tooltipEl.style.transform = "translate(-50%, 0)";
      tooltipEl.style.transition = "all .1s ease";

      const table = document.createElement("table");
      table.style.margin = "0px";

      tooltipEl.appendChild(table);
      chart.canvas.parentNode.appendChild(tooltipEl);
    }

    return tooltipEl;
  };

  const externalTooltipHandler = (context) => {
    // Tooltip Element
    const { chart, tooltip } = context;
    const tooltipEl = getOrCreateTooltip(chart);

    // Hide if no tooltip
    if (tooltip.opacity === 0) {
      tooltipEl.style.opacity = 0;
      return;
    }

    // Set Text
    if (tooltip.body) {
      const titleLines = tooltip.title || [];
      const bodyLines = tooltip.body.map((b) => b.lines);

      const tableHead = document.createElement("thead");

      titleLines.forEach((title) => {
        const s_format =
          videoTime >= 3600
            ? moment.utc(title * 1000).format("HH:mm:ss")
            : moment.utc(title * 1000).format("mm:ss");
        const tr = document.createElement("tr");
        tr.style.borderWidth = 0;

        const th = document.createElement("th");
        th.style.borderWidth = 0;
        const text = document.createTextNode(s_format);

        th.appendChild(text);
        tr.appendChild(th);
        tableHead.appendChild(tr);
      });

      const tableBody = document.createElement("tbody");
      bodyLines.forEach((body, i) => {
        const textArr = body[0].split(": ");
        var b_value = textArr.pop();
        const colors = tooltip.labelColors[i];

        const span = document.createElement("span");
        span.style.background = colors.backgroundColor;
        span.style.borderColor = colors.borderColor;
        span.style.borderWidth = "2px";
        span.style.marginRight = "10px";
        span.style.height = "10px";
        span.style.width = "10px";
        span.style.display = "inline-block";

        const tr = document.createElement("tr");
        tr.style.backgroundColor = "inherit";
        tr.style.borderWidth = 0;

        const td = document.createElement("td");
        td.style.borderWidth = 0;

        const text = document.createTextNode(`${b_value} %`);

        td.appendChild(span);
        td.appendChild(text);
        tr.appendChild(td);
        tableBody.appendChild(tr);
      });

      const tableRoot = tooltipEl.querySelector("table");

      // Remove old children
      while (tableRoot.firstChild) {
        tableRoot.firstChild.remove();
      }

      // Add new children
      tableRoot.appendChild(tableHead);
      tableRoot.appendChild(tableBody);
    }

    const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

    // Display, position, and set styles for font
    tooltipEl.style.opacity = 1;
    tooltipEl.style.left = positionX + tooltip.caretX + "px";
    tooltipEl.style.top = positionY + tooltip.caretY + "px";
    tooltipEl.style.font = tooltip.options.bodyFont.string;
    tooltipEl.style.padding =
      tooltip.options.padding + "px " + tooltip.options.padding + "px";
  };

  // -------------------------------------
  // --- CREATE THE GAPHICS AND INSERT ---
  // -------------------------------------
  useEffect(() => {
    // const ctx = canvasEl.current.getContext("2d");
    const ctx = document.getElementById("myChart");

    const labels =
      numVideos === 1
        ? Array.from(Array(videoTime).keys())
        : duration_1 > duration_2
        ? Array.from(Array(duration_1).keys())
        : Array.from(Array(duration_2).keys());

    const data = {
      labels,
      datasets:
        numVideos === 1
          ? [
              {
                label: videoName,
                borderColor: color,
                backgroundColor: color,
                tension: 0.4,
                data: matriz.map((value) => ({
                  x: value.x,
                  y: value.y,
                })),
                pointRadius: 0,
                borderWidth: 2,
                spanGaps: false,
              },
            ]
          : [
              {
                label: videoName[0],
                borderColor: color[0],
                backgroundColor: color[0],
                tension: 0.4,
                data: matriz.map((value) => ({
                  x: value.x,
                  y: value.y,
                })),
                pointRadius: 0,
                borderWidth: 2,
                spanGaps: false,
                yAxisID: "y",
              },
              {
                label: videoName[1],
                borderColor: color[1],
                backgroundColor: color[1],
                tension: 0.4,
                data: matriz_2.map((value) => ({
                  x: value.x,
                  y: value.y,
                })),
                pointRadius: 0,
                borderWidth: 2,
                spanGaps: false,
                yAxisID: "y",
              },
            ],
    };

    // ----------------------------------------------
    // --- PLUGIN FOR DRAW THE TIME LINE ON CHART ---
    // ----------------------------------------------
    const timeLine = {
      id: "timeLine",
      beforeDraw(chart, args, options) {
        const {
          ctx,
          chartArea: { top, right, bottom, left, width, height },
          scales: { x, y },
        } = chart;
        ctx.save();

        ctx.strokeStyle = options.timeLineColor;
        ctx.strokeRect(x.getPixelForValue(options.xPosition), top, 0, height);

        ctx.restore();
      },
    };

    // ----------------------------
    // --- UPDATE THE LINE TIME ---
    // ----------------------------
    const updateLineTime = (myChart, position) => {
      myChart.options.plugins.timeLine.xPosition = position;
      myChart.update();
      setVideoCurrentTime(position);
      setLineTimeChart(parseInt(position));
    };
    
    // ------------------------
    // --- SET CHART CONFIG ---
    // ------------------------
    const config = {
      type: "line",
      data: data,
      options: {
        responsive: true,
        interaction: {
          mode: "index",
          intersect: false,
        },
        stacked: false,
        plugins: {
          title: {
            display: true,
            text: numVideos === 1 ? "VIDEO ANALYTICS" : "VIDEOS ANALYTICS",
          },
          timeLine: {
            timeLineColor: numVideos === 1 ? color : color[videoSelected - 1],
            xPosition: videoCurrentTime,
          },
          tooltip: {
            enabled: false,
            position: "nearest",
            external: externalTooltipHandler,
          },
        },
        onClick: (e) => {
          const canvasPosition = getRelativePosition(e, myLineChart);
          const dataX = myLineChart.scales.x.getValueForPixel(canvasPosition.x);
          const dataY = myLineChart.scales.y.getValueForPixel(canvasPosition.y);

          updateLineTime(myLineChart, dataX);
        },
        scales: {
          x: {
            grid: {
              color: "rgba(0, 0, 0, 0)",
            },
            ticks: {
              callback: function (value, index, ticks) {
                if (absoluteTime === true) {
                  if (index == 0) {
                    return "0:00";
                  }
                  if (index == half_time_seconds) {
                    return half_time_string;
                  }
                  if (index == full_time_seconds - 1) {
                    return full_time_string;
                  }
                } else {
                  if (index == 0) {
                    return "0%";
                  }
                  if (index == half_time_seconds) {
                    return "50%";
                  }
                  if (index == full_time_seconds - 1) {
                    return "100%";
                  }
                }
              },
            },
          },
          y: {
            type: "linear",
            title: {
              display: true,
              text: "Percentage (%)",
            },
            position: "left",
          },
        },
      },
      plugins: [timeLine],
    };

    // -----------------------------
    // --- CREATE THE LINE CHART ---
    // -----------------------------
    const myLineChart = new Chart(ctx, config);

    return function cleanup() {
      myLineChart.destroy();
    };

  }, [videoTime, absoluteTime]);

  // -----------------------------------------------
  // --- Change the Y line position (chart) when ---
  // --- change the videoCurrentTime             ---
  // -----------------------------------------------
  useEffect(() => {
    const graph = Chart.getChart(canvasEl.current.getContext("2d"));
    graph.config._config.options.plugins.timeLine.xPosition = videoCurrentTime;
    graph.update();
  }, [videoCurrentTime]);

  
  return (
    <div>
      {/* <Line options={options} data={data} /> */}
      <canvas id="myChart" ref={canvasEl} />
    </div>
  );
}

export default LineChart;
