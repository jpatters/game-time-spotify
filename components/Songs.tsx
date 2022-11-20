import { useState } from "react";
import Song from "./Song";

const play = ({ player, spotify_uri, deviceId, position }: any) => {
  player._options.getOAuthToken((access_token: string) => {
    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
      method: "PUT",
      body: JSON.stringify({ uris: [spotify_uri], position_ms: position }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });
  });
};

const Songs = ({ songs, player, deviceId }: any) => {
  const [currentSong, setCurrentSong] = useState<string>("");

  const playSong = (id: string, position: number) => {
    setCurrentSong(id);
    play({
      player,
      deviceId,
      spotify_uri: id,
      position: position,
    });
  };

  const stopSong = () => {
    setCurrentSong("");
    player.pause();
  };

  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-md h-full">
      <ul role="list" className="divide-y divide-gray-200">
        {songs.map((song: any) => (
          <Song
            key={song.id}
            song={song}
            playSong={playSong}
            stopSong={stopSong}
            currentSong={currentSong}
          />
        ))}
      </ul>
    </div>
  );
};

export default Songs;
