import db from "../db.server";
import { handleDelete } from "./utils";

export async function isSongLikedByUser(userId: string, apiId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      likedSongs: {
        where: { apiId: apiId },
        select: { id: true },
      },
    },
  });
  return (user?.likedSongs ?? []).length > 0;
}

export async function getUserLikedSongs(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      likedSongs: {
        select: {
          id: true,
          title: true,
          apiId: true,
          artistName: true, // ✅ Corregido para usar `artistName` en lugar de `artist`
        },
      },
    },
  });
  return user?.likedSongs ?? [];
}

export async function addSongToLikes(userId: string, apiId: string, songData: { title: string; artistName: string; releaseDate?: Date; photo_song: string; duration?: number }) {
  // Buscar o crear la canción
  const song = await db.song.upsert({
    where: { apiId: apiId },
    update: {},
    create: {
      title: songData.title,
      apiId: apiId,
      artistName: songData.artistName, // ✅ Se usa `artistName` en lugar de `artistId`
      releaseDate: songData.releaseDate,
      photo_song: songData.photo_song,
      duration: songData.duration,
    },
  });

  // Conectar usuario con la canción
  await db.user.update({
    where: { id: userId },
    data: {
      likedSongs: { connect: { id: song.id } },
    },
  });
}

export async function removeSongFromLikes(userId: string, apiId: string) {
  const song = await db.song.findUnique({
    where: { apiId: apiId },
    select: { id: true },
  });

  if (!song) return;

  await db.user.update({
    where: { id: userId },
    data: { likedSongs: { disconnect: { id: song.id } } },
  });

  const stillLiked = await db.user.findFirst({
    where: { likedSongs: { some: { id: song.id } } },
  });

  if (!stillLiked) {
    await handleDelete(() => db.song.delete({ where: { id: song.id } }));
  }
}
