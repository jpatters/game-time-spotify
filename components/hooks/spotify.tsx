import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect } from "react";
import React, { useState } from "react";
import Script from "next/script";

type SContext = {
  player: any;
  deviceId: string | undefined;
  isLoading: boolean;
  isError: boolean;
  error: string | undefined;
};

const SpotifyContext = createContext<SContext>({} as SContext);

export const SpotifyPlayer = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();

  const [deviceId, setDeviceId] = useState<string | undefined>(undefined);
  const [player, setPlayer] = useState();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!session) {
      console.log("here");
      return;
    }

    // @ts-ignore
    window.onSpotifyWebPlaybackSDKReady = () => {
      // @ts-ignore
      const spotifyPlayer = new Spotify.Player({
        name: "Web Playback SDK Quick Start Player",
        getOAuthToken: (cb: (token: string | undefined) => void) => {
          cb(session.accessToken);
        },
        volume: 0.5,
      });

      spotifyPlayer.addListener(
        "ready",
        ({ device_id }: { device_id: string }) => {
          console.log("Ready with Device ID", device_id);
          setDeviceId(device_id);
          setPlayer(spotifyPlayer);
          setIsLoading(false);
        }
      );

      // spotifyPlayer.addListener(
      //   "player_state_changed",
      //   ({ position, duration, track_window: { current_track } }: any) => {
      //     console.log("Currently Playing", current_track);
      //     console.log("Position in Song", position);
      //     console.log("Duration of Song", duration);
      //   }
      // );

      spotifyPlayer.addListener(
        "not_ready",
        ({ device_id }: { device_id: string }) => {
          console.log("Device ID has gone offline", device_id);
          setDeviceId(deviceId);
          setIsError(true);
          setIsLoading(false);
          setError("Device ID has gone offline");
        }
      );

      spotifyPlayer.addListener(
        "initialization_error",
        ({ message }: { message: string }) => {
          setIsLoading(false);
          setIsError(true);
          setError(message);
        }
      );

      spotifyPlayer.addListener(
        "authentication_error",
        ({ message }: { message: string }) => {
          setIsLoading(false);
          setIsError(true);
          setError(message);
        }
      );

      spotifyPlayer.addListener(
        "account_error",
        ({ message }: { message: string }) => {
          setIsLoading(false);
          setIsError(true);
          setError(message);
        }
      );

      spotifyPlayer.connect();
    };
  }, [session]);

  const spotifyContext = {
    deviceId,
    player,
    isLoading,
    isError,
    error,
  };

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <SpotifyContext.Provider value={spotifyContext}>
      <Script src="https://sdk.scdn.co/spotify-player.js" />
      {children}
    </SpotifyContext.Provider>
  );
};

export const useSpotifyDevice = () => {
  return useContext(SpotifyContext);
};
