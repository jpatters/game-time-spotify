import { PlayIcon, StopIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useEffect, useRef, useMemo } from "react";
import debounce from "lodash.debounce";

interface Props {
  song: SpotifyApi.PlaylistTrackObject;
  currentSong: string;
  playSong: (id: string, position: number) => void;
  stopSong: () => void;
  player: any;
}

const Song = ({ song, currentSong, playSong, stopSong, player }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const play = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    player.activateElement();
    if (currentSong !== song.track!.uri) {
      let position: number;
      if (inputRef.current) {
        const p = inputRef.current.value;
        const minutes = parseInt(p.split(":")[0]);
        const rest = p.split(":")[1];
        if (rest && rest.includes(".")) {
          const seconds = parseInt(rest.split(".")[0]);
          const milliseconds = parseInt(rest.split(".")[1]);
          position = minutes * 60000 + seconds * 1000 + milliseconds;
        } else {
          const seconds = parseInt(rest);
          position = minutes * 60000 + seconds * 1000;
        }
      } else {
        position = 0;
      }

      playSong(song.track!.uri, position || 0);
    } else {
      stopSong();
    }
  };

  const updatePosition = async () => {
    if (inputRef.current) {
      await fetch("/api/song/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          songId: song.track!.uri,
          startPosition: inputRef.current.value,
        }),
      });
    }
  };

  const debouncedChangeHandler = useMemo(
    () => debounce(updatePosition, 1000),
    []
  );

  useEffect(() => {
    return () => {
      debouncedChangeHandler.cancel();
    };
  });

  useEffect(() => {
    async function getPosition() {
      const res = await fetch(`/api/song/${song.track!.uri}`);
      const data = await res.json();
      if (inputRef.current) {
        inputRef.current.value = data.startPosition;
      }
    }
    getPosition();
  }, [song]);

  if (!song.track) {
    return <></>;
  }

  return (
    <li>
      <div className="block hover:bg-gray-50">
        <div className="flex items-center px-4 py-4 sm:px-6">
          <div className="flex min-w-0 flex-1 items-center">
            {song.track!.album.images && (
              <div className="flex-shrink-0">
                <Image
                  className="h-12 w-12 rounded-full"
                  src={song.track.album.images[0].url}
                  width={48}
                  height={48}
                  alt=""
                />
              </div>
            )}
            <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
              <div>
                <p className="truncate text-sm font-medium text-indigo-600">
                  {song.track.name}
                  {song.track.artists && (
                    <span className="truncate text-sm text-gray-500">
                      {song.track.artists[0].name}
                    </span>
                  )}
                </p>
              </div>
              <div className="block">
                <div>
                  <a href="#" onClick={play} className="text-sm text-gray-900">
                    {currentSong === song.track.uri ? (
                      <StopIcon
                        className="h-8 w-8 text-red-300"
                        aria-hidden="true"
                      />
                    ) : (
                      <PlayIcon
                        className="h-8 w-8 text-green-500"
                        aria-hidden="true"
                      />
                    )}
                  </a>
                </div>
              </div>
              <div className="block">
                <div>
                  <p className="text-sm text-gray-900">
                    <input
                      ref={inputRef}
                      id={song.track.id}
                      type="text"
                      defaultValue="0"
                      onChange={debouncedChangeHandler}
                    />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default Song;
