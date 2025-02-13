import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData} from "@remix-run/react";
import { getSpotifyAdminToken } from "~/.server/spotify";
import Song from "~/components/Song";
import { fetchWithRetry } from "~/utils/fetchWithRetry";
import { getSession } from "~/utils/session";

export const loader: LoaderFunction = async ({ request, params }) => {
  const offset = params.offset ?? "0";
  const token = await getSpotifyAdminToken();
  const cookie = await request.headers.get('cookie');
  const session = await getSession(cookie);
  const claveArtista = `https://api.spotify.com/v1/search?q=genre:pop&type=artist&limit=6&offset=${offset}`;
  const datosArtist = session.get(claveArtista).find((artista: any) => {
    return artista.id === params.id;
  });
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const canciones = await fetchWithRetry(
    `https://api.spotify.com/v1/artists/${params.id}/top-tracks?limit=10`,
    options
  );

  if (!canciones) throw new Response("Artista no encontrado", { status: 404 });

  return { canciones: canciones.tracks, token, datosArtist };
};

export default function ArtistDetail() {
  const { canciones, token, datosArtist} = useLoaderData<typeof loader>();
  return (
    <div className="artist-detail">
      <img
        className="artist-detail-img"
        src={datosArtist.images[0]?.url || ""}
        alt={datosArtist.name}
      />
      <h1 className="artist-detail-name">{datosArtist.name}</h1>
      <p className="artist-detail-genres">
        Géneros: {datosArtist.genres?.join(", ") || "No disponible"}
      </p>
      <p className="artist-detail-followers">
        Seguidores: {datosArtist.followers?.total.toLocaleString() || "N/A"}
      </p>
      <ul>

        {canciones.map((cancion: any) => {
          let artistas = cancion.artists.map((artista: any) => {
            return artista.name;
          });
          artistas = artistas.length === 1 ? artistas[0] : artistas.slice(0, -1).join(", ") + " y " + artistas[artistas.length - 1];
          return <li key={cancion.id}>
            <Song
              token={token}
              songData={{
                id: cancion.id,
                title: cancion.name,
                artist: artistas,
                name_album: cancion.album.name,
                photo: cancion.album.images[0].url,
                duration: cancion.duration_ms,
                url: cancion.uri,
              }}
            />
          </li>;
        })}
      </ul>
    </div>
  );
}