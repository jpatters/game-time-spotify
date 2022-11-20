import Head from "next/head";
import { useSpotifyDevice } from "../../components/hooks/spotify";
import { default as SpotifySDK } from "spotify-web-api-node";
import { unstable_getServerSession } from "next-auth/next";
import { GetServerSideProps } from "next";
import { authOptions } from "../../auth-config";
import Songs from "../../components/Songs";

export default function Playlist({
  songs,
}: {
  songs: SpotifyApi.PlaylistTrackObject[];
}) {
  const { player, deviceId, isLoading } = useSpotifyDevice();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!deviceId) {
    return <div>Device not found</div>;
  }

  return (
    <div>
      <Head>
        <title>Nextjs | Next-Auth</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Songs songs={songs} player={player} deviceId={deviceId} />
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

  if (!session || !context.params || !context.params.id) {
    return { props: {} };
  }

  var spotifyApi = new SpotifySDK({ accessToken: session.accessToken });

  let songId = context.params.id as string;

  try {
    const response = await spotifyApi.getPlaylist(songId);
    return {
      props: {
        songs: response.body.tracks.items,
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
