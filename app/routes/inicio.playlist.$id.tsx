import { ActionFunctionArgs, json, LoaderFunction } from "@remix-run/node";
import { useLoaderData} from "@remix-run/react";
import { getSpotifyAdminToken } from "~/.server/spotify";
import Song, { SongData } from "~/components/Song";
import { addSongToLikes, isSongLikedByUser, removeSongFromLikes } from "~/models/song.server";
import { requiredLoggedInUser } from "~/utils/auth_server";
import { random_colour } from "~/utils/colours";
import { convert_ms_h } from "~/utils/convert_time";
import { fetchWithRetry } from "~/utils/fetchWithRetry";
import { getSession } from "~/utils/session";
import { z } from "zod";
import { validateForm } from "~/utils/validateform";
import { addSongToPlaylist, checkedPlaylist, createPlaylistWithSong, getAllLikedSongs, getSongsFromPlaylist, getUserPlaylists } from "~/models/playlist.server";


export const loader: LoaderFunction = async ({ request, params }) => {
  await requiredLoggedInUser(request);
  const cookie = request.headers.get("cookie");
  const session = await getSession(cookie);
  const user = session.get("userId");

  const likedSongs = await getAllLikedSongs(user);
  const playlists = await getUserPlaylists(user);
  const token = await getSpotifyAdminToken();

  const playlistData = await checkedPlaylist(params.id!, user);

  let canciones: SongData[] = [];
  let duration_ms = 0;
  let playlist = null;

  if (playlistData) {
    const storedSongs = await getSongsFromPlaylist(params.id!);

    canciones = storedSongs!.map((song: any) => ({
      id: song.apiId,
      title: song.title,
      artist: song.artistName,
      playlistId: playlistData.id,
      name_album: song.name_album,
      photo: song.photo_song,
      duration: song.duration,
      url: song.url,
    }));

    storedSongs!.forEach((song: any) => {
      duration_ms += song.duration;
    });

    playlist = {
      name: playlistData.name,
      description: playlistData.description || "",
      photo: playlistData.photo,
      owner: session.get("username"),
    };
  } else {
    const sessionPlaylists = session.get("https://api.spotify.com/v1/me/playlists?limit=6");
    const matchedPlaylist = sessionPlaylists?.find((pl: any) => pl.id === params.id);
    playlist = {
      id: matchedPlaylist.id,
      name: matchedPlaylist.name,
      description: matchedPlaylist.description || "Sin descripción",
      photo: matchedPlaylist.images?.[0]?.url || "/default-playlist.jpg",
      owner: matchedPlaylist.owner?.display_name || "Desconocido",
    };
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const playlistTracks = await fetchWithRetry(
      `https://api.spotify.com/v1/playlists/${params.id}/tracks`,
      options
    );

    canciones = playlistTracks.items.map((item: any) => ({
      id: item.track.id,
      title: item.track.name,
      artist: item.track.artists.map((artista: any) => artista.name).join(", "),
      artistId: item.track.artists[0].id,
      name_album: item.track.album.name,
      photo: item.track.album.images[0]?.url || "",
      duration: item.track.duration_ms,
      url: item.track.uri,
    }));

    playlistTracks.items.forEach((item: any) => {
      duration_ms += item.track.duration_ms;
    });
  }

  const colour = random_colour();

  return { canciones, id: params.id, duration_ms, token, colour, likedSongs, playlists, playlist };
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


export default function Playlist() {
  const { canciones, duration_ms, token, colour, likedSongs, playlists, playlist } = useLoaderData<typeof loader>();

  if (!playlist) {
    return <p className="text-center text-white text-xl">No se encontró la playlist.</p>;
  }

  const duration = convert_ms_h(duration_ms);

  return (
    <div className="bg-grey m-8 text-text-white rounded-2xl overflow-hidden pb-4">
      <div className="flex mb-8" style={{ backgroundImage: `linear-gradient(to bottom, ${colour}, #121212)` }}>
        <img
          src={playlist.photo}
          className="w-[20%] h-auto rounded-2xl rounded-tr-none rounded-bl-none"
          alt={`${playlist.name} cover`}
        />
        <div className="w-[80%] flex flex-col justify-between p-8">
          <h1 className="text-3xl">{playlist.name}</h1>
          <p>{playlist.description}</p>
          <p>{`${playlist.owner}. ${canciones.length} canciones, ${duration} aproximadamente`}</p>
        </div>
      </div>
      <div>
        <ul>
          {canciones.map((cancion: SongData) => (
            <li key={cancion.id}>
              <Song
                token={token}
                songData={{
                  id: cancion.id,
                  title: cancion.title,
                  artist: cancion.artist,
                  artistId: cancion.artistId,
                  name_album: cancion.name_album,
                  photo: cancion.photo,
                  duration: cancion.duration,
                  url: cancion.url
                }}
                likedSongs={likedSongs}
                playlists={playlists}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
