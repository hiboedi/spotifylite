import Head from "next/head";
import Sidebar from "../components/Sidebar";
import Center from "../components/Center";
import { getSession } from "next-auth/react";

export default function Home() {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <Head>
        <title>SpotifyLite</title>
      </Head>
      <main className="flex">
        <Sidebar />
        <Center />
      </main>
      {/* Player */}
    </div>
  );
}
export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: { session },
  };
}