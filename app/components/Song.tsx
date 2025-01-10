import { useState, useRef } from "react";
import PlayButton from "./PlayButton";

type SongsProps = {
  id: number;
  showOnlyPlayButton?: boolean;
};

export function Song({ id, showOnlyPlayButton = false }: SongsProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  /*
  const song = getSongById(id);
  const artista = song?.artist_id ? getArtistById(song.artist_id) : null;
  */

  const song = {
    id: 1,
    title: "NIGGACLAUS",
    artist_id: 1,
    genre: "Pop",
    photo: "https://niggaclaus.xyz/assets/images/image01.png?v=56a91d47", 
    duration: 150,
    url: "", 
  };

  const artista = {
    id: 1,
    name: "Artista Ejemplo",
  };

  const minutes = Math.trunc(song.duration / 60);
  const seconds = `0${Math.trunc(song.duration % 60)}`;
  const duracion = `${minutes}:${seconds.slice(-2)}`;

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
            <img src={song.photo} className="h-12 rounded-lg" alt={`${song.title} cover`} />
            <div className="h-full w-4/5 flex items-center pl-4">
              <h3 className="w-[35%] text-start">{song.title}</h3>
              <p className="text-sm font-light w-[40%] text-start">{artista.name}</p>
              <p className="text-xs font-light w-[25%] text-start">{song.genre}</p>
            </div>
          </header>
          <footer className="w-1/5 flex justify-around items-center">
            <p className="text-sm font-thin">{duracion}</p>
            <PlayButton onPlay={toggleAudio} estado={isPlaying} />
            <audio ref={audioRef} src={song.url} />
          </footer>
        </>
      )}

      {showOnlyPlayButton && (
        <footer className="mr-8 h-24 w-24 flex items-center justify-center">
          <PlayButton onPlay={toggleAudio} estado={isPlaying} />
          <audio ref={audioRef} src={song.url} />
        </footer>
      )}
    </article>
  );
}

export default Song;
