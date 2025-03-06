import { Link, useMatches } from "@remix-run/react";
import React from "react";
import { Artist } from "~/components/Artist";
import { Playlist } from "~/components/Playlist";



export default function Index() {
  const matches = useMatches();
  const datos = matches.find((match) => match.id === "routes/inicio")?.data;
  const offset = datos.offset;
  const artists = datos.artists;
  const playlists = datos.playlists;
  return (
    <React.Fragment>
      {/* Carrusel de Artistas */}
      <div className="text-center mb-8 text-text-secondary pt-4 px-4">
        <h2 className="text-3xl font-bold mb-4">Artistas Populares</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {artists.map((artist: any) => (
            <div
              key={artist.id}
              className="p-4 bg-gray-800 rounded-lg hover:shadow-lg transition-shadow"
            >
              <Artist
                id={artist.id}
                name={artist.name}
                profile_image={artist.images[0]?.url}
                offset={offset}
              />
            </div>
          ))}
        </div>

        {/* Botones de Paginación */}
        <div className="flex justify-between max-w-sm mx-auto mt-6">
          <div>
            {offset > 0 && (
              <Link
                to={`/inicio?offset=${offset - 6}`}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Anterior
              </Link>
            
            )}
          </div>

          <div>
            {offset < 24 && (
              <Link
              to={`/inicio?offset=${offset + 6}`}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Siguiente
            </Link>
            )}


          </div>

        </div>
      </div>

      {/* Playlists */}
      <div className="w-[100%] flex flex-wrap justify-center">
        <h1 className="w-full text-3xl flex justify-center font-bold">
          Playlists de BeatHub
        </h1>
        {playlists.map((playlist: any) => (
          <Playlist
            key={playlist.id}
            id={playlist.id}
            name={playlist.name}
            url={playlist.images[0]?.url}
          />
        ))}
      </div>
    </React.Fragment>
  );
}