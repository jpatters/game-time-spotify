import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import ProtectedComponent from "../components/ProtectedComponent";
import { SpotifyPlayer } from "../components/hooks/spotify";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <SpotifyPlayer>
        <ProtectedComponent>
          <Component {...pageProps} />
        </ProtectedComponent>
      </SpotifyPlayer>
    </SessionProvider>
  );
}
