import { Link, useMatches } from "@remix-run/react";
import React from "react";
import { Playlist } from "~/components/Playlist";


export default function Index() {
  const matches=useMatches();
  const datosApi=matches.find(match=>match.id==="routes/inicio")?.data;
  const offset=datosApi.offset;
  const artists=datosApi.artists;
  const playlists=datosApi.playlists;
  return (
    <React.Fragment>
      {/* Carrusel de Artistas */}
      <div className="text-center mb-8 text-text-secondary">
        <h2 className="text-3xl font-bold mb-4">Artistas Populares</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {artists.map((artist: any) => (
            <div
              key={artist.id}
              className="p-4 bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <img
                src={artist.images[0]?.url}
                alt={artist.name}
                className="w-24 h-24 mx-auto rounded-full object-cover mb-4"
              />
              <h3 className="text-lg font-medium text-white text-center">
                {artist.name}
              </h3>
            </div>
          ))}
        </div>

        {/* Botones de Paginación */}
        <div className="flex justify-between max-w-sm mx-auto mt-6">
          {offset > 0 && (
            <Link
              to={`/?offset=${offset - 6}`}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Anterior
            </Link>
          )}
          <Link
            to={`/?offset=${offset + 6}`}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Siguiente
          </Link>
        </div>
      </div>
      <div className="w-[100%] flex flex-wrap justify-center">
        <h1 className="w-full text-3xl flex justify-center font-bold">Playlists de BeatHub</h1>
        {playlists.map((playlist: any) =>
            <Playlist key={playlist.id} id={playlist.id} name={playlist.name} url={playlist.images[0].url}/>
        )}
      </div>
    </React.Fragment>
  );
}
