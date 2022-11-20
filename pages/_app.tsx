import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import ProtectedComponent from "../components/ProtectedComponent";
import Script from "next/script";
import { SpotifyPlayer } from "../components/hooks/spotify";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <SpotifyPlayer>
        <Script src="https://sdk.scdn.co/spotify-player.js" />
        <ProtectedComponent>
          <Component {...pageProps} />
        </ProtectedComponent>
      </SpotifyPlayer>
    </SessionProvider>
  );
}
