import { getSession } from "next-auth/react";

export default async (req, res) => {
  const session = await getSession({ req });

  const getVideoAnalytics = async (data) => {
    const url = `https://youtubeanalytics.googleapis.com/v2/reports?dimensions=${data.dimensions}&endDate=${data.endDate}&filters=video%3D%3D${data.videoID}%3BaudienceType%3D%3DORGANIC&ids=channel%3D%3DMINE&metrics=${data.metrics.replace(',','%2C')}&startDate=${data.startDate}&key=${data.key}`;
    const video = await fetch(url, {
      headers: new Headers({
        'Authorization': `Bearer ${data.token}`, 
        'Accept': 'application/json'
      }), 
    }).then((res) => res.json());

    return {
      url: url,
      video: video,
    };
  };
  const getVideo = async (data) => {
    const url = `https://www.googleapis.com/youtube/v3/videos?id=${data.videoID}&key=${data.key}&part=${data.part}`;
    const video = await fetch(url).then((res) => res.json());

    return {
      url: url,
      video: video,
    };
  };

  if (session) {
    try {
      const method = req.method;
      const params = req.query;

      switch (method) {
        case "GET":
          // ----- QUERYS | /api/youtube/analytics?xxxx -----
          if (Object.keys(params).length > 0) {
            if (Object.keys(params).length === 1) {
              if (params.id.length > 0) {

                const data = {
                  videoID: params.id,
                  key: process.env.GOOGLE_API_KEY,
                  dimensions: "elapsedVideoTimeRatio",
                  endDate: "2022-03-10",
                  filters: `video==${params.id};audienceType==ORGANIC`,
                  ids: "channel==MINE",
                  metrics: "audienceWatchRatio,relativeRetentionPerformance",
                  startDate: "2014-05-01",
                  part: "snippet,contentDetails,statistics,status,player",
                  token: session.accessToken
                }

                const video_analytics = await getVideoAnalytics(data);
                const video = await getVideo(data);

                res.status(200).json({
                  request:  {
                    1: {
                      video: video.url,
                      video_analytics: video_analytics.url
                    }
                  },
                  videos: {
                    1: video.video,
                  },
                  videos_analytics: {
                    1: video_analytics.video
                  },
                  num: 1,
                });

              } else {
                res.status(400).json({ error: "Missed id param" });
              }
            } else if (Object.keys(params).length === 2) {
              if (params.id.length > 0 && params.id2.length > 0) {
                const data_1 = {
                  videoID: params.id,
                  key: process.env.GOOGLE_API_KEY,
                  dimensions: "elapsedVideoTimeRatio",
                  endDate: "2022-03-10",
                  filters: `video==${params.id};audienceType==ORGANIC`,
                  ids: "channel==MINE",
                  metrics: "audienceWatchRatio,relativeRetentionPerformance",
                  startDate: "2014-05-01",
                  part: "snippet,contentDetails,statistics,status,player",
                  token: session.accessToken
                }
                const data_2 = {
                  videoID: params.id2,
                  key: process.env.GOOGLE_API_KEY,
                  dimensions: "elapsedVideoTimeRatio",
                  endDate: "2022-03-10",
                  filters: `video==${params.id2};audienceType==ORGANIC`,
                  ids: "channel==MINE",
                  metrics: "audienceWatchRatio,relativeRetentionPerformance",
                  startDate: "2014-05-01",
                  part: "snippet,contentDetails,statistics,status,player",
                  token: session.accessToken
                }
                const video = await getVideo(data_1)
                const video_analytics = await getVideoAnalytics(data_1);
                const video_2 = await getVideo(data_2)
                const video_analytics_2 = await getVideoAnalytics(data_2);

                res.status(200).json({
                  request: {
                    1: {
                      video: video.url,
                      video_analytics: video_analytics.url,
                    },
                    2: {
                      video: video_2.url,
                      video_analytics: video_analytics_2.url,
                    }
                  },
                  videos: {
                    1: video.video,
                    2: video_2.video,
                  },
                  videos_analytics: {
                    1: video_analytics.video,
                    2: video_analytics_2.video,
                  },
                  num: 2
                });
              } else {
                res.status(400).json({ error: "Missed id params" });
              }
            } else {
              res.status(404).json({ error: "Nothing here ;)" });
            }
          } else {
            res.status(400).json({ error: "Need params for this API call" });
          }
          break;
        default:
          res.status(404).json({ error: "Nothing here :)" });
      }
    } catch (e) {
      res.status(500).json({
        error_name: e.name,
        error_msg: e.message,
        error: "Unable to use API",
      });
    }
  } else {
    res.status(404).json({ error: "Login for use the API" });
  }
};






// /**
//  * Sample Node.js code for youtubeAnalytics.reports.query
//  * See instructions for running these code samples locally:
//  * https://developers.google.com/explorer-help/code-samples#nodejs
//  */

//  const fs = require("fs");
//  const readline = require("readline");
//  const { google } = require("googleapis");
 
//  const scope = ["https://www.googleapis.com/auth/youtube.readonly"];
 
//  // Load client secrets from a local file.
//  fs.readFile("../../../utils/client_secret_189380978309-b9kcmm0o20svo2fsol9s63cfr7k6ajms.apps.googleusercontent.com.json", (err, content) => {
//    if (err) {
//      return console.log("Cannot load client secret file:", err);
//    }
 
//    // Authorize a client with credentials, then make API call.
//    const credentials = JSON.parse(content);
//    const {client_secret, client_id, redirect_uris } = credentials.installed;
//   //  const client_secret = process.env.GOOGLE_SECRET
//    const oAuth2Client = new google.auth.OAuth2(
//        client_id,
//        client_secret,
//        redirect_uris[0]
//    );

//    console.log(oAuth2Client);
 
//    const authUrl = oAuth2Client.generateAuthUrl({
//      access_type: "offline",
//      scope: scope
//    });
//    console.log("Visit this URL to authorize this app:", authUrl);
 
//    const rl = readline.createInterface({
//      input: process.stdin,
//      output: process.stdout
//    });
//    rl.question("Enter the auth code from that URL: ", code => {
//      rl.close();
//      oAuth2Client.getToken(code, (err, token) => {
//        if (err) return callApi(err);
//        oAuth2Client.setCredentials(token);
//        callApi(oAuth2Client);
//      });
//    });
//  });
 
//  /**
//   * Define and execute the API request.
//   * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
//   */
//  var callApi = auth => {
//    const youtubeAnalytics = google.youtubeAnalytics({ version: "v2", auth });
 
//    youtubeAnalytics.reports
//      .query({
//        dimensions: "elapsedVideoTimeRatio",
//        endDate: "2022-01-01",
//        filters: "video==YPRRYC2Gu08;audienceType==ORGANIC",
//        ids: "channel==MINE",
//        metrics: "audienceWatchRatio,relativeRetentionPerformance",
//        startDate: "2014-05-01"
//      })
//      .then(data => console.log(data.data))
//      .catch(error => console.log("The API returned an error: ", error.errors));
//  };
 