import db from "../db.server";
import { handleDelete } from "./utils";

export async function isSongLikedByUser(userId: string, apiId: string): Promise<boolean> {
  const likedPlaylist = await db.playlist.findFirst({
    where: {
      userId,
      name: "Canciones que te gustan",
      songs: {
        some: { apiId: apiId },
      },
    },
    select: { id: true },
  });
  return !!likedPlaylist;
}



export async function addSongToLikes(
  userId: string,
  apiId: string,
  title: string,
  artistName: string,
  photo_song: string,
  name_album: string,
  duration: number,
  url: string
) {
  const song = await db.song.upsert({
    where: { apiId: apiId },
    update: {},
    create: {
      title,
      apiId,
      artistName,
      name_album,
      photo_song,
      duration,
      url,
    },
  });

  let likedPlaylist = await db.playlist.findFirst({
    where: {
      userId,
      name: "Canciones que te gustan",
    },
  });

  if (!likedPlaylist) {
    likedPlaylist = await db.playlist.create({
      data: {
        userId,
        name: "Canciones que te gustan",
        description:"Disfruta de las canciones que más te gustan.",
        photo: "https://misc.scdn.co/liked-songs/liked-songs-300.jpg",
      },
    });
  }

  await db.playlist.update({
    where: { id: likedPlaylist.id },
    data: {
      songs: { connect: { id: song.id } },
    },
  });
}

export async function removeSongFromLikes(userId: string, apiId: string) {
  const song = await db.song.findUnique({
    where: { apiId },
    select: { id: true },
  });

  if (!song) return;

  const likedPlaylist = await db.playlist.findFirst({
    where: {
      userId,
      name: "Canciones que te gustan",
    },
  });

  if (!likedPlaylist) return;

  await db.playlist.update({
    where: { id: likedPlaylist.id },
    data: { songs: { disconnect: { id: song.id } } },
  });

  const updatedPlaylist = await db.playlist.findFirst({
    where: { id: likedPlaylist.id },
    include: { songs: true },
  });

  if (updatedPlaylist?.songs.length === 0) {
    await handleDelete(() => db.playlist.delete({ where: { id: updatedPlaylist.id } }));
  }

  const songInOtherPlaylists = await db.playlist.findFirst({
    where: {
      songs: { some: { id: song.id } },
    },
  });

  if (!songInOtherPlaylists) {
    await handleDelete(() => db.song.delete({ where: { id: song.id } }));
  }
}