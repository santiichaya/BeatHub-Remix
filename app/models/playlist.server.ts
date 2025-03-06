import { deleteImageFromCloudinary } from "~/utils/deleteHandler";
import db from "../db.server";
import { handleDelete } from "./utils";

export async function createPlaylistWithSong(
  userId: string,
    apiId: string,
    title: string,
    artistName: string,
    name_album: string,
    photo_song: string,
    duration: number,
    url: string,
) {
  const song = await db.song.upsert({
    where: { apiId: apiId },
    update: {},
    create: {
      apiId: apiId,
      title: title,
      artistName: artistName,
      name_album: name_album,
      photo_song: photo_song,
      duration: duration,
      url: url,
    },
  });

  await db.playlist.create({
    data: {
      name: title,
      userId: userId,
      photo:photo_song,
      description:"",
      songs: {
        connect: { id: song.id },
      },
    },
  });
}

export async function deletePlaylist(playlistId: string) {
  const playlist = await db.playlist.findUnique({
    where: { id: playlistId },
    select: { photo: true },
  });

  if (playlist?.photo) {
    await deleteImageFromCloudinary(playlist.photo);
  }

  await handleDelete(() => db.playlist.delete({ where: { id: playlistId } }));
}

export async function updatePlaylist(
  playlistId: string,
  name: string,
  description: string,
  imageUrl: string
) {
  return await db.playlist.update({
    where: { id: playlistId },
    data: {
      name,
      description,
      photo: imageUrl,
    },
  });
}


export async function createPlaylist(userId: string, name: string, imageUrl: string, description: string) {
  await db.playlist.create({
    data: {
      name,
      photo: imageUrl,
      description,
      userId,
    },
  });
}


export async function getSongsFromPlaylist(playlistId: string) {
  const playlist = await db.playlist.findUnique({
    where: { id: playlistId },
    include: {
      songs: true,
    },
  });

  return playlist ? playlist.songs : null;
}



export async function checkedPlaylist(playlistId: string, userId: string) {
  const playlist = await db.playlist.findUnique({
    where: {
      id: playlistId,
      userId: userId,
    },
  });

  return playlist || null;
}



export async function getUserPlaylists(userId:string) {
  return await db.playlist.findMany({
    where: { userId },
    include: {
      songs: true,
    },
  });
}

export async function getAllLikedSongs(userId: string) {
  const likedPlaylist = await db.playlist.findFirst({
    where: {
      userId,
      name: "Canciones que te gustan",
    },
    include: {
      songs: true,
    },
  });

  return likedPlaylist?.songs ?? [];
}

export async function addSongToPlaylist(
    playlistId: string,
    apiId: string,
    title: string,
    artistName: string,
    name_album: string,
    photo_song: string,
    duration: number,
    url: string
  ) {
    const song = await db.song.upsert({
      where: { apiId }, 
      update: {},
      create: {
        apiId,
        title,
        artistName,
        name_album,
        photo_song,
        duration,
        url,
      },
    });
  
    await db.playlist.update({
      where: { id: playlistId },
      data: {
        songs: {
          connect: { id: song.id },
        },
      },
    });
  }

