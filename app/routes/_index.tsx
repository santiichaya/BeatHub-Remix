import { useLoaderData, Link } from "@remix-run/react";
import {LoaderFunction } from "@remix-run/node";
import React from "react";
import { getSpotifyAdminToken } from "~/.server/spotify";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const offset = parseInt(url.searchParams.get("offset") || "0");
  const token = await getSpotifyAdminToken();
  const artistResponse = await fetch(
    `https://api.spotify.com/v1/search?q=genre:pop&type=artist&limit=6&offset=${offset}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const artistData = await artistResponse.json();

  return { artists: artistData.artists.items, offset};
};


export default function Index() {
  const { artists, offset} = useLoaderData<typeof loader>();
  return (
    <React.Fragment>
      {/* Carrusel de Artistas */}
      <div className="text-center mb-8">
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
              <h3 className="text-lg font-medium text-white text-center">{artist.name}</h3>
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
    </React.Fragment>
  );
}
