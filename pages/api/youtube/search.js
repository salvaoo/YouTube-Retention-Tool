import { getSession } from "next-auth/react";

export default async (req, res) => {
  const session = await getSession({ req });

  const getSearch = async (data) => {
    const url = `https://youtube.googleapis.com/youtube/v3/search?q=${data.query}&part=${data.part.replace(',','%2C')}&forMine=${data.forMine}&key=${data.key}`;
    const search = await fetch(url, {
      headers: new Headers({
        'Authorization': `Bearer ${data.token}`, 
        'Accept': 'application/json'
      }), 
    }).then((res) => res.json());

    return {
      request: url,
      search: search,
    };
  };

  if (session) {
    try {
      const method = req.method;
      const params = req.query;

      switch (method) {
        case "GET":
          // ----- QUERYS | /api/youtube/search?xxxx -----
          if (Object.keys(params).length > 0) {
            if (params.q.length > 0) {
              const data = {
                query: params.q,
                part: "id,snippet",
                forMine: 'false',
                key: process.env.GOOGLE_API_KEY,
                token: session.accessToken
              }

              const search = await getSearch(data);

              res.status(200).json({
                result: search,
              });

            } else {
              res.status(400).json({ error: "Missed search word" });
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
