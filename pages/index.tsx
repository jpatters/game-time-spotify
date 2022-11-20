import Head from "next/head";
import { default as SpotifySDK } from "spotify-web-api-node";
import { unstable_getServerSession } from "next-auth/next";
import { GetServerSideProps } from "next";
import { authOptions } from "../auth-config";
import { useSpotifyDevice } from "../components/hooks/spotify";
import Playlists from "../components/Playlists";

export default function Home({
  playlists,
}: {
  playlists: SpotifyApi.PlaylistObjectSimplified[];
}) {
  const { player, deviceId, isLoading } = useSpotifyDevice();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Head>
        <title>Nextjs | Next-Auth</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Playlists playlists={playlists} />
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session) {
    return { props: {} };
  }

  var spotifyApi = new SpotifySDK({ accessToken: session.accessToken });
  try {
    const response = await spotifyApi.getUserPlaylists();
    return {
      props: {
        playlists: response.body.items,
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }
};
