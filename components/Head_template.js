import Head from 'next/head'


function Head_template({ title, description_content, icon }) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description_content} />
      <link rel="icon" href={icon} />
    </Head>
  );
}

export default Head_template;
