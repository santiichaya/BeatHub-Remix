import { useFetcher } from "@remix-run/react";
import { useState } from "react";
import ReactModal from "react-modal";
import { AddPlayList, HeartIcon, HeartSolidIcon } from "./icons";
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
  playlists: any[];
};

export function Song({ token, songData, likedSongs, playlists }: SongsProps) {
  const fetcher = useFetcher();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

  const handleLike = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300); // Duración de la animación

    fetcher.submit(
      {
        _action: "song",
        title: songData.title,
        apiId: songData.id,
        artistName: songData.artist,
        name_album: songData.name_album,
        photo_song: songData.photo,
        duration: songData.duration,
        url: songData.url,
      },
      { method: "POST" }
    );
  };

  const handleSubmit = (playlistId = null) => {
    fetcher.submit(
      {
        _action: playlistId ? "addSongToPlaylist" : "createPlaylistWithSong",
        playlistId: playlistId || "",
        apiId: songData.id,
        title: songData.title,
        artistName: songData.artist,
        name_album: songData.name_album,
        photo_song: songData.photo,
        duration: songData.duration,
        url: songData.url,
      },
      { method: "POST" }
    );

    setIsModalOpen(false);
  };

  const filteredPlaylists = playlists.filter((playlist) =>
    playlist.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full flex justify-center">
      <article className="h-12 w-[95%] flex justify-between bg-black bg-opacity-70 rounded-lg overflow-hidden m-2 text-text-secondary">
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

          <button
            onClick={handleLike}
            className={`p-2 transition-transform duration-300 ${isAnimating ? "scale-125" : "scale-100"}`}
          >
            {likedSongs.some((song) => song.apiId === songData.id) ? <HeartSolidIcon /> : <HeartIcon />}
          </button>


          <button onClick={() => setIsModalOpen(true)} className="p-2"><AddPlayList /></button>

          <PlayButton accessToken={token} trackUri={songData.url} />
        </footer>
      </article>

      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="md:h-fit lg:w-1/3 md:mx-auto md:mt-24 p-4 rounded-md bg-gray-900 text-white shadow-md outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <div className="flex justify-between mb-4">
          <h1 className="text-lg font-bold">Gestionar Listas</h1>
          <button onClick={() => {
            setSearchTerm("");
            setIsModalOpen(false)
          }}
            className="text-white text-2xl">
            &times;
          </button>
        </div>

        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Busca una lista"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 bg-gray-700 text-white rounded-lg pl-10 outline-none"
          />
          <span className="absolute left-3 top-2 text-gray-400">🔍</span>
        </div>

        <div className={`overflow-hidden ${filteredPlaylists.length > 3 ? "max-h-40 overflow-y-auto" : ""}`}>
          {filteredPlaylists.length > 0 ? (
            filteredPlaylists.map((playlist) => (
              <button
                key={playlist.id}
                onClick={() => handleSubmit(playlist.id)}
                className="w-full p-2 text-white bg-gray-800 rounded-lg hover:bg-gray-700 transition my-1"
              >
                🎵 {playlist.name}
              </button>
            ))
          ) : (
            <p className="text-gray-400 text-center">No se encontraron playlists</p>
          )}
        </div>

        <button
          onClick={() => handleSubmit(null)}
          className="flex items-center text-white text-lg p-2 hover:underline mt-4"
        >
          ➕ Nueva lista
        </button>
      </ReactModal>
    </div>
  );
}

export default Song;
