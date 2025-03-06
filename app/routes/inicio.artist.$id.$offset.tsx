import type { ActionFunctionArgs, LoaderFunction } from "@remix-run/node";
import { json, useFetcher, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { getSpotifyAdminToken } from "~/.server/spotify";
import Song from "~/components/Song";
import { addArtistToLikes, getFollowedArtists, isFollowingArtist, removeArtistFromLikes } from "~/models/artist.server";
import { addSongToPlaylist, createPlaylistWithSong, getAllLikedSongs, getUserPlaylists } from "~/models/playlist.server";
import { addSongToLikes, isSongLikedByUser, removeSongFromLikes } from "~/models/song.server";
import { requiredLoggedInUser } from "~/utils/auth_server";
import { fetchWithRetry } from "~/utils/fetchWithRetry";
import { getSession } from "~/utils/session";
import { validateForm } from "~/utils/validateform";

export const loader: LoaderFunction = async ({ request, params }) => {
  await requiredLoggedInUser(request);
  const cookie = await request.headers.get("cookie");
  const session = await getSession(cookie);
  const user = session.get("userId");
  const likedSongs = await getAllLikedSongs(user);
  const playlists = await getUserPlaylists(user);
  const followedArtists = await getFollowedArtists(user);
  const offset = params.offset ?? "0";
  const token = await getSpotifyAdminToken();
  const claveArtista = `https://api.spotify.com/v1/search?q=genre:pop&type=artist&limit=6&offset=${offset}`;

  let datosArtist = session.get(claveArtista)?.find((artista: any) => artista.id === params.id);

  if (!datosArtist) {
    const res = await fetch(`https://api.spotify.com/v1/artists/${params.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      datosArtist = await res.json();
    }
  }

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

  return { canciones: canciones.tracks, token, datosArtist, likedSongs, followedArtists, playlists };
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

export const artistSchema = z.object({
  name: z.string().min(1, "El nombre del artista es requerido"),
  apiId: z.string().min(1, "El API ID es requerido"),
  photo_artist: z.string().url("La URL de la foto del artista no es válida"),
});

export const PlaylistSchema = songSchema.extend({
  playlistId: z.string().min(1, "El ID de la playlist es requerido"),
});

export const action = async ({ request }: ActionFunctionArgs) => {
  await requiredLoggedInUser(request);

  const cookie = request.headers.get("cookie");
  const session = await getSession(cookie);
  const userId = session.get("userId");

  const formData = await request.formData();
  const actionType = formData.get("_action");

  switch (actionType) {
    case "artist":
      return validateForm(
        formData,
        artistSchema,
        async (data) => {
          const { name, apiId, photo_artist } = data;

          const isLiked = await isFollowingArtist(userId, apiId);
          if (isLiked) {
            await removeArtistFromLikes(userId, apiId);
            return json({ success: true, liked: false });
          } else {
            await addArtistToLikes(userId, apiId, name, photo_artist);
            return json({ success: true, liked: true });
          }
        },
        (errors) => json({ errors }, { status: 400 })
      );

    case "song":
      return validateForm(
        formData,
        songSchema,
        async (data) => {
          const { title, apiId, artistName, name_album, photo_song, duration, url } = data;

          const isLiked = await isSongLikedByUser(userId, apiId);
          if (isLiked) {
            await removeSongFromLikes(userId, apiId);
            return json({ success: true, liked: false });
          } else {
            await addSongToLikes(userId, apiId, title, artistName, photo_song, name_album, duration, url);
            return json({ success: true, liked: true });
          }
        },
        (errors) => json({ errors }, { status: 400 })
      );

    case "createPlaylistWithSong":
      return validateForm(
        formData,
        songSchema,
        async (data) => {
          const { apiId, title, artistName, name_album, photo_song, duration, url } = data;

          await createPlaylistWithSong(userId, apiId, title, artistName, name_album, photo_song, duration, url);
          return json({ success: true });
        },
        (errors) => json({ errors }, { status: 400 })
      );

    case "addSongToPlaylist":
      return validateForm(
        formData,
        PlaylistSchema,
        async (data) => {
          const { playlistId, apiId, title, artistName, name_album, photo_song, duration, url } = data;

          await addSongToPlaylist(playlistId, apiId, title, artistName, name_album, photo_song, duration, url);
          return json({ success: true });
        },
        (errors) => json({ errors }, { status: 400 })
      );

    default:
      return json({ error: "Acción no válida" }, { status: 400 });
  }
};



export default function ArtistDetail() {
  const { canciones, token, datosArtist, likedSongs, followedArtists, playlists } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  const isFollowing = followedArtists.some((artist: any) => artist.apiId === datosArtist.id);

  const handleFollow = () => {
    fetcher.submit(
      {
        _action: "artist",
        apiId: datosArtist.id,
        name: datosArtist.name,
        photo_artist: datosArtist.images[0]?.url || "",
      },
      { method: "POST" }
    );
  };

  return (
    <div className="w-[100%] min-h-screen overflow-hidden bg-cover bg-center pb-24"
      style={{
        backgroundImage: `url(${datosArtist.images[0]?.url})`
      }}
    >
      <div className="bg-gradient-to-b from-black to-transparent p-8 pt-4">
        <div className="flex justify-between">
          <h1 className="text-6xl md:text-8xl mb-2">{datosArtist.name}</h1>
          <button
            onClick={handleFollow}
            className={`mt-2 px-4 py-2 rounded-lg font-medium transition w-28 h-16 align-middle ${isFollowing ? "bg-gray-500 text-white" : "bg-blue-500 text-white"
              }`}
          >
            {isFollowing ? "Siguiendo" : "Seguir"}
          </button>
        </div>

        <div className="flex justify-between mb-[25rem]">
          <p>
            Géneros: {datosArtist.genres?.join(", ") || "No disponible"}
          </p>
          <p>
            Seguidores: {datosArtist.followers?.total.toLocaleString() || "N/A"}
          </p>
        </div>
      </div>




      <ul>
        {canciones.map((cancion: any) => {
          let artistas = cancion.artists.map((artista: any) => artista.name);
          artistas = artistas.length === 1 ? artistas[0] : artistas.slice(0, -1).join(", ") + " y " + artistas[artistas.length - 1];

          return (
            <li key={cancion.id}>
              <Song
                token={token}
                songData={{
                  id: cancion.id,
                  title: cancion.name,
                  artist: artistas,
                  artistId:cancion.artists.id,
                  name_album: cancion.album.name,
                  photo: cancion.album.images[0].url,
                  duration: cancion.duration_ms,
                  url: cancion.uri,
                }}
                likedSongs={likedSongs}
                playlists={playlists} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}