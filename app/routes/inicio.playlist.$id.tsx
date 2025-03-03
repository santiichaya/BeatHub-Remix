import { ActionFunctionArgs, json, LoaderFunction } from "@remix-run/node";
import { useLoaderData, useMatches } from "@remix-run/react";
import { getSpotifyAdminToken } from "~/.server/spotify";
import Song from "~/components/Song";
import { addSongToLikes, getUserLikedSongs, isSongLikedByUser, removeSongFromLikes } from "~/models/song.server";
import { requiredLoggedInUser } from "~/utils/auth_server";
import { random_colour } from "~/utils/colours";
import { convert_ms_h } from "~/utils/convert_time";
import { fetchWithRetry } from "~/utils/fetchWithRetry";
import { getSession } from "~/utils/session";
import { z } from "zod";
import { validateForm } from "~/utils/validateform";
import { addSongToPlaylist, createPlaylistWithSong, getUserPlaylists } from "~/models/playlist.server";


export const loader: LoaderFunction = async ({ request,params }) => {
  await requiredLoggedInUser(request);
  const cookie = await request.headers.get('cookie');
  const session = await getSession(cookie);
  const user=session.get('userId');
  const likedSongs=await getUserLikedSongs(user);
  const playlists = await getUserPlaylists(user);
  const token = await getSpotifyAdminToken();
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const playlistData = await fetchWithRetry(`https://api.spotify.com/v1/playlists/${params.id}/tracks`, options);
  const canciones: Array<any> = [];
  let duration_ms = 0;
  playlistData.items.forEach((item: any) => {
    canciones.push(item.track);
    duration_ms = duration_ms + item.track.duration_ms;
  });
  const colour = random_colour();
  return { canciones, id: params.id, duration_ms, token, colour ,likedSongs,playlists};
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
  const { canciones, id, duration_ms, token, colour,likedSongs,playlists} = useLoaderData<typeof loader>();
  const matches = useMatches(); //El hook useMatches sirve para poder obtener datos de las rutas padres desde las rutas hijas sin tener que pasar props manualmente, muy parecido al useContext().
  const datosplaylists = matches.find(match => match.id === 'routes/inicio')?.data; //Siempre es mejor utilizar match.id ya que es el identificador único de la ruta, el cual Remix genera automáticamente a partir de la estructura de archivos de mi proyecto.
  let datosplaylist = datosplaylists.playlists.filter((playlist: any) => {
    return playlist.id === id;
  });
  datosplaylist = datosplaylist[0];
  const duration = convert_ms_h(duration_ms, datosplaylist.type);

  return (
    <div className="bg-grey m-8 text-text-white rounded-2xl overflow-hidden pb-4">
      <div className="flex mb-8" style={{ backgroundImage: `linear-gradient(to bottom, ${colour}, #121212)` }}>
        <img src={datosplaylist.images[0].url} className="w-[20%] h-auto rounded-2xl" alt={`${datosplaylist.name} cover`} />
        <div className="w-[80%] flex flex-col justify-between p-8">
          <h1 className="text-3xl">{datosplaylist.name}</h1>
          <p>{datosplaylist.description}</p>
          <p>{`${datosplaylist.owner.display_name}. ${datosplaylist.tracks.total} canciones ${duration} aproximadamente`}</p>
        </div>
      </div>
      <div>
        <ul>
          {canciones.map((cancion: any) => {
            let artistas = cancion.artists.map((artista: any) => {
              return artista.name;
            });
            artistas = artistas.length === 1 ? artistas[0] : artistas.slice(0, -1).join(", ") + " y " + artistas[artistas.length - 1];
            return <li key={cancion.id}>
              <Song token={token} songData={{
                id: cancion.id,
                title: cancion.name,
                artist: artistas,
                name_album: cancion.album.name,
                photo: cancion.album.images[0].url,
                duration: cancion.duration_ms,
                url: cancion.uri
              }}
              likedSongs={likedSongs} 
              playlists={playlists}>
              </Song>
            </li>
          })}
        </ul>
      </div>
    </div>
  );
}