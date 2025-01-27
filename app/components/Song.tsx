import { useState, useRef, Key } from "react";
import PlayButton from "./PlayButton";
import { Artist } from "@prisma/client";

type SongData = {
  id:string|number
  title: string;
  artist:string;
  genre: string;
  photo: string;
  duration: number;
  url: string;
};

type SongsProps = {
  id:Key;
  showOnlyPlayButton?: boolean;
  songData: SongData;
};

export function Song({ id, showOnlyPlayButton = false, songData }: SongsProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((error) => {
          console.error("Error al reproducir el audio:", error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const minutes = Math.trunc(songData.duration / 60);
  const seconds = `0${Math.trunc(songData.duration % 60)}`;
  const duracion = `${minutes}:${seconds.slice(-2)}`;

  return (
    <article
      className={`${
        showOnlyPlayButton
          ? "h-16 flex items-center justify-end bg-transparent p-0 m-0"
          : "h-12 w-[98%] flex justify-between bg-[#247BA0] rounded-lg overflow-hidden m-2"
      }`}
    >
      {!showOnlyPlayButton && (
        <>
          <header className="w-4/5 flex items-center">
            <img src={songData.photo} className="h-12 rounded-lg" alt={`${songData.title} cover`} />
            <div className="h-full w-4/5 flex items-center pl-4">
              <h3 className="w-[35%] text-start">{songData.title}</h3>
              <p className="text-sm font-light w-[40%] text-start">{songData.artist}</p>
              <p className="text-xs font-light w-[25%] text-start">{songData.genre}</p>
            </div>
          </header>
          <footer className="w-1/5 flex justify-around items-center">
            <p className="text-sm font-thin">{duracion}</p>
            <PlayButton onPlay={toggleAudio} estado={isPlaying} />
            <audio ref={audioRef} src={songData.url} />
          </footer>
        </>
      )}

      {showOnlyPlayButton && (
        <footer className="mr-8 h-24 w-24 flex items-center justify-center">
          <PlayButton onPlay={toggleAudio} estado={isPlaying} />
          <audio ref={audioRef} src={songData.url} />
        </footer>
      )}
    </article>
  );
}

export default Song;
