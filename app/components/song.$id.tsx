// app/routes/song.$id.tsx
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { search } from "~/models/search.server"; // Reutilizamos la búsqueda desde el modelo
import Song from "~/components/Song";

export const loader = async ({ params }: { params: { id: string } }) => {
  const { id } = params;

  // Realizamos la búsqueda de la canción por ID
  const result = await search(id, "track", 0, 1); // Solo buscamos 1 track específico
  const song = result.tracks?.items?.[0];

  if (!song) {
    throw new Response("Canción no encontrada", { status: 404 });
  }

  return json({
    song: {
      id: song.id,
      title: song.name,
      artist: song.artists[0]?.name || "Desconocido",
      genre: song.genre, // Spotify no siempre incluye el género en la búsqueda
      photo: song.album.images[0]?.url || "",
      duration: song.duration_ms / 1000, // Convertimos de milisegundos a segundos
      url: "",
    },
  });
};

export default function SongPage() {
  const { song } = useLoaderData<typeof loader>();

  return (
    <div className="song-page">
      <Song
        id={song.id}
        showOnlyPlayButton={false}
        songData={{
          id: song.id,
          title: song.title,
          artist: song.artist,
          genre: song.genre,
          photo: song.photo,
          duration: song.duration,
          url: song.url,
        }}
      />
    </div>
  );
}
