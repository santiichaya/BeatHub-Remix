import type { ActionFunctionArgs, LoaderFunction } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { getSpotifyAdminToken } from "~/.server/spotify";
import Song from "~/components/Song";
import { addSongToLikes, getUserLikedSongs, isSongLikedByUser, removeSongFromLikes } from "~/models/song.server";
import { requiredLoggedInUser } from "~/utils/auth_server";
import { fetchWithRetry } from "~/utils/fetchWithRetry";
import { getSession } from "~/utils/session";
import { validateForm } from "~/utils/validateform";

export const loader: LoaderFunction = async ({ request, params }) => {
  await requiredLoggedInUser(request);
  const cookie = await request.headers.get('cookie');
  const session = await getSession(cookie);
  const user = session.get('userId');
  const likedSongs = await getUserLikedSongs(user);
  const offset = params.offset ?? "0";
  const token = await getSpotifyAdminToken();
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

  return { canciones: canciones.tracks, token, datosArtist, likedSongs };
};

export const songSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  apiId: z.string().min(1, "El API ID es requerido"),
  artistName: z.string().min(1, "El nombre del artista es requerido"),
  name_album: z.string().min(1, "El nombre del álbum es requerido"),
  photo_song: z.string().url("La URL de la foto no es válida"),
  duration: z.coerce.number().positive("La duración debe ser un número positivo"), //Con coerce convertimos a numero el duration que viene como string en el fetcher.
  url: z.string().url("La URL de la pista no es válida"),
});


export const action = async ({ request }: ActionFunctionArgs) => {
  await requiredLoggedInUser(request);
  const cookie = request.headers.get("cookie");
  const session = await getSession(cookie);
  const user = session.get("userId");
  const formData = await request.formData();
  return validateForm(
    formData,
    songSchema,
    async (data) => {
      const { title, apiId, artistName, name_album, photo_song, duration,url } = data;
      const isLiked = await isSongLikedByUser(user, apiId);
      if (isLiked) {
        await removeSongFromLikes(user, apiId);
        return json({ success: true, liked: false });
      } else {
        await addSongToLikes(user, apiId, title, artistName, photo_song, name_album, duration,url);
        return json({ success: true, liked: true });
      }
    },
    (errors) => json({ errors }, { status: 400 })
  );
};


export default function ArtistDetail() {
  const { canciones, token, datosArtist, likedSongs } = useLoaderData<typeof loader>();
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
              }} likedSongs={likedSongs} />
          </li>;
        })}
      </ul>
    </div>
  );
}