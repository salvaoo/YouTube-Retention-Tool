import { getSession } from "next-auth/react";

export default async (req, res) => {
  const session = await getSession({ req });

  const getVideo = async (id, key, part) => {
    const url = `https://www.googleapis.com/youtube/v3/videos?id=${id}&key=${key}&part=${part}`;
    const video = await fetch(url).then((res) => res.json());

    return {
      url: url,
      video: video,
    };
  };

  if (session) {
    try {
      const google_api_key = process.env.GOOGLE_API_KEY;
      const part = "snippet,contentDetails,statistics,status,player";
      const method = req.method;
      const params = req.query;

      switch (method) {
        case "GET":
          // ----- QUERYS | /api/youtube/video?xxxx -----
          if (Object.keys(params).length > 0) {
            if (Object.keys(params).length === 1) {
              if (params.id.length > 0) {
                const video = await getVideo(params.id, google_api_key, part);

                res.status(200).json({
                  request: video.url,
                  videos: {
                    1: video.video,
                  },
                  num: 1,
                });
              } else {
                res.status(400).json({ error: "Missed id param" });
              }
            } else if (Object.keys(params).length === 2) {
              if (params.id.length > 0 && params.id2.length > 0) {
                const video = await getVideo(params.id, google_api_key, part)
                const video_2 = await getVideo(params.id2, google_api_key, part)

                res.status(200).json({
                  request: {
                    url_1: video.url,
                    url_2: video_2.url,
                  },
                  videos: {
                    1: video.video,
                    2: video_2.video,
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
