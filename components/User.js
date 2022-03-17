import { useSession, signIn, signOut } from "next-auth/react";

function User() {
  const { data: session } = useSession();

  return (
    <div
      className="absolute right-5 top-5 bg-black text-white pl-2 pr-5 py-2 rounded-full cursor-pointer flex items-center gap-2 transition-all hover:pr-6 hover:pl-3"
      onClick={!session ? signIn : signOut}
    >
      <img className="rounded-full w-8 h-8" src={session?.user.image} />
      <p className="text-sm">{session?.user.name}</p>
    </div>

  );
}

export default User;
