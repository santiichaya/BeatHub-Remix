// app/routes/search.tsx

import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { search } from "~/models/search.server";
import Song from "~/components/Song";
import SearchBar from "~/components/SearchBar";
import SearchResults from "~/components/SearchResults";
import { Artist } from "~/components/Artist";
import Album from "~/components/Album";
import { Key } from "react";

export const loader = async ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("q") || ""; // Obtener la consulta de búsqueda
  const type = url.searchParams.get("type") || "track";
  const result = await search(query, type);
  const offset = parseInt(url.searchParams.get("offset") || "0", 10);
  const limit = parseInt(url.searchParams.get("limit") || "10", 10);

  const songs = result.tracks?.items.map((track: { id: any; name: any; artists: { name: any }[]; album: { images: { url: any }[] }; duration_ms: number; }) => ({
    id: track.id,
    title: track.name,
    artist: track.artists[0]?.name || "Desconocido",
    genre: "",
    photo: track.album.images[0]?.url || "",
    duration: track.duration_ms / 1000,
    url: "",
  })) || [];

  const artists = result.artists?.items.map((artist: { id: any; name: any }) => ({
    id: artist.id,
    name: artist.name || "Desconocido",
    profile_image: "",
  })) || [];

  const albums = result.albums?.items.map((album: { id: string | number | bigint; name: any }) => ({
    id: album.id,
    name: album.name || "Desconocido",  
  })) || [];

  return json({
    songs,
    artists,
    albums,
    offset,
    limit,
    query,
    type,
  });
};

export default function SearchPage() {
  const { songs, artists, albums, offset, limit, query, type } = useLoaderData<typeof loader>();

  return (
    <div className="search-page">
      <SearchBar />
      <div className="flex flex-col">
        {songs.length ? (
          songs.map((song: { id: any; title?: string; artist?: string; genre?: string; photo?: string; duration?: number; url?: string; }) => (
            <Song key={song.id} id={song.id}  songData={{
                id: song.id,
                title: song.title || "Título desconocido",
                artist: song.artist || "Artista desconocido",
                genre: song.genre || "Género desconocido",
                photo: song.photo || "/placeholder.jpg",
                duration: song.duration || 0,
                url: song.url || "",
              }} />
          ))
        ) : (
          <p>No se encontraron canciones.</p>
        )}
        {artists.length ? (
          artists.map((artist: { id: string | number; name: string; profile_image: string | undefined; }) => (
            <Artist key={artist.id} id={artist.id} name={artist.name} profile_image={artist.profile_image} />
          ))
        ) : (
          <p>No se encontraron artistas.</p>
        )}
        {albums.length ? (
          albums.map((album: { id:string | number | bigint; name: string }) => (
            <Album key={album.id} id={album.id} name={album.name} />
          ))
        ) : (
          <p>No se encontraron álbumes.</p>
        )}
        <SearchResults
          tracks={songs}
          artists={artists}
          albums={albums}
          offset={offset}
          limit={limit}
          query={query}
          type={type}
        />
      </div>
    </div>
  );
}
