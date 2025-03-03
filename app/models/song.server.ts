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
    include: { likedSongs: true },
  });
  return user?.likedSongs ?? [];
}

export async function addSongToLikes(userId: string, apiId: string,title: string, artistName: string ,photo_song:string, name_album:string, duration: number,url:string) {
  const song = await db.song.upsert({
    where: { apiId: apiId },
    update: {},
    create: {
      title: title,
      apiId: apiId,
      artistName: artistName, 
      name_album: name_album,
      photo_song: photo_song,
      duration: duration,
      url:url
    },
  });

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
