import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import SearchBar from "~/components/SearchBar";
import Song from "~/components/Song";
import { Artist } from "~/components/Artist";
import { search } from "~/models/search.server";
import { getSpotifyAdminToken } from "~/.server/spotify";
import { getSession } from "~/utils/session";
import { getAllLikedSongs, getUserPlaylists } from "~/models/playlist.server";

export const loader = async ({ request }: { request: Request }) => {
  const cookie = await request.headers.get('cookie');
  const session = await getSession(cookie);
  const user = session.get('userId');
  const likedSongs = await getAllLikedSongs(user);
  const playlists = await getUserPlaylists(user);
  const token = await getSpotifyAdminToken();
  const url = new URL(request.url);
  const query = url.searchParams.get("q") || "";
  const offset = parseInt(url.searchParams.get("offset") || "0", 10);
  const limit = parseInt(url.searchParams.get("limit") || "10", 10);

  const result = await search(query, "artist,track", offset, limit);

  const songs = result.tracks?.items?.map((track: any) => ({
    id: track.id,
    title: track.name || "Desconocido",
    artist: track.artists?.map((a: any) => a.name).join(", ") || "Desconocido",
    artistId: track.artists.id,
    name_album: track.album?.name || "Álbum desconocido",
    photo: track.album?.images?.[0]?.url || "/placeholder.jpg",
    duration: track.duration_ms,
    url: track.uri,
  })) || [];

  const artists = result.artists?.items
    ?.filter((artist: any) => artist.name.toLowerCase().includes(query))
    .map((artist: any) => ({
      id: artist.id,
      name: artist.name || "Desconocido",
      profile_image: artist.images?.[0]?.url || "/placeholder.jpg",
    })) || [];


  return json({
    songs,
    artists,
    offset,
    limit,
    query,
    token,
    likedSongs,
    playlists
  });
};

export default function SearchPage() {
  const { songs, artists, offset, query, token, likedSongs, playlists } = useLoaderData<typeof loader>();

  return (
    <div className="p-8">
      <SearchBar initialQuery={query} />

      <div className="bg-grey p-8 mt-8 rounded-[30px]">
        {/* Canciones */}
        <h2 className="text-3xl mb-8">Canciones</h2>
        {songs.length ? (
          songs.map((song: any) => (
            <Song
              key={song.id}
              token={token!}
              songData={song}
              likedSongs={likedSongs}
              playlists={playlists}
            />
          ))
        ) : (
          <p>No se encontraron canciones.</p>
        )}

        <div>
          <h2 className="text-3xl mb-8">Artistas</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {artists.length ? (
            artists.map((artist: any) => (
              <div
                key={artist.id}
                className="p-4 bg-gray-800 rounded-lg hover:shadow-lg transition-shadow"
              >
                <Artist
                  id={artist.id}
                  name={artist.name}
                  profile_image={artist.profile_image}
                  offset={offset}
                />
              </div>
            ))
          ) : (
            <p>No se encontraron artistas.</p>
          )}
          </div>
        </div>

      </div>
    </div>
  );
}
