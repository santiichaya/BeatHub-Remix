import { useFetcher } from "@remix-run/react";
import { HeartIcon, HeartSolidIcon } from "./icons";
import PlayButton from "./PlayButton";
import { convert_ms_h } from "~/utils/convert_time";

type SongData = {
  id: string;
  title: string;
  artist: string;
  name_album: string;
  photo: string;
  duration: number;
  url: string;
};

type SongsProps = {
  token: string;
  songData: SongData;
  likedSongs: any[];
};

export function Song({ token, songData, likedSongs }: SongsProps) {
  const fetcher = useFetcher();

  const handleLike = () => {
    fetcher.submit(
      {
        title: songData.title,
        apiId: songData.id,
        artistId: songData.artist,
        releaseDate: null, // Ajusta si es necesario
        photo_song: songData.photo,
        duration: songData.duration,
      },
      { method: "POST" }
    );
  };

  return (
    <article className="h-12 w-[98%] flex justify-between bg-[#247BA0] rounded-lg overflow-hidden m-2 text-text-secondary">
      <header className="w-4/5 flex items-center">
        <img src={songData.photo} className="h-12 rounded-lg" alt={`${songData.title} cover`} />
        <div className="h-full w-4/5 flex items-center pl-4">
          <h3 className="w-[35%] text-start">{songData.title}</h3>
          <p className="text-sm font-light w-[40%] text-start">{songData.artist}</p>
          <p className="text-xs font-light w-[25%] text-start">{songData.name_album}</p>
        </div>
      </header>
      <footer className="w-1/5 flex justify-around items-center">
        <p className="text-sm font-thin">{convert_ms_h(songData.duration)}</p>

        {/* Botón de Like */}
        <button onClick={handleLike} className="p-2">
          {likedSongs.some((song) => song.id === songData.id) ? <HeartSolidIcon /> : <HeartIcon />}
        </button>
        <PlayButton accessToken={token} trackUri={songData.url} />
      </footer>
    </article>
  );
}

export default Song;
