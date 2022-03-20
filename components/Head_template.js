import Head from 'next/head'
import { useEffect } from 'react'

function Head_template({ title, description_content, icon }) {

  useEffect(() => {
    let host = window.location.hostname;
    if (host === "localhost") {
      window[`ga-disable-${process.env.GOOGLE_ANALYTICS}`] = true;
      console.log('GA disabled');
    }else {
      console.log('GA enable');
    }
  }, [])

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description_content} />
      <meta name="author" content="salvagr.com" />
      <link rel="icon" href={icon} />
      {/* Global site tag (gtag.js) - Google Analytics */}
      <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
        />
        <script
        dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}',{
            page_path: window.location.pathname,
          });`,
          }}
        />
    </Head>
  );
}

export default Head_template;
