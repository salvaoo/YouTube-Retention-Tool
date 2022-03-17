import Head from "../components/Head_template";
import User from "../components/User";
import { useRouter } from "next/router";

const bg_colors = [
  "bg-red-400",
  "bg-cyan-400",
  "bg-yellow-400",
  "bg-violet-400",
]

function tool({ props }) {

  return (
    <div className="relative">
      <Head
        title="Tool | YouTube Retention Tool"
        description_content="YouTube Retention Tool app"
        icon="/youicon.ico"
      />

      <User />

      <main className="text-center py-10 h-screen">
        
      </main>
    </div>
  )
}

export default tool

export async function getServerSideProps(context) {

  const num_v = Object.keys(context.query).length;
  const v = context.query;
  let inputs = {};

  if (num_v === 2) {
    inputs = {
      1: v.video_link_1.split("/")[3],
      2: v.video_link_2.split("/")[3],
    };
  } else {
    inputs = {
      1: v.video_link_1.split("/")[3],
    };
  }

  console.log({inputs});

  // const url = `${process.env.NEXTAUTH_URL}/api/youtube/video?id=${inputs[1]}${num_v === 2 ? `&id2=${inputs[2]}` : ""}`;
  // console.log({url});
  // const res = await fetch(url).then((res) => res.json());

  // console.log(res);

  return {
    props: {}, // will be passed to the page component as props
  }
}