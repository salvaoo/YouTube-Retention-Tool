import { getProviders, signIn } from "next-auth/react"
import Head from '../components/Head_template'
import Image from 'next/image'
import logo from "../public/youlogo.png";


function login({ providers }) {
  
  return (
    <div className="flex flex-col items-center bg-white min-h-screen w-full justify-center">
      <Head 
        title="Login | YouTube Retention Tool"
        description_content="YouTube Retention Tool app"
        icon="/youicon.ico"
      />

      <Image
        src={logo}
        width={500}
        height={280}
        alt="YouTube Logo"
      />

      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button className="bg-red-500 text-white px-8 py-4 rounded-2xl hover:border-red-500 hover:border-2 transition-all ease-in-out duration-300 hover:text-red-500 hover:bg-white" onClick={() => signIn(provider.id, { callbackUrl: "/" })}>Login with YouTube</button>
        </div>
      ))}
    </div>
  )
}

export default login

export async function getServerSideProps() {
  const providers = await getProviders()

  return {
    props: {
      providers,
    }
  };
}