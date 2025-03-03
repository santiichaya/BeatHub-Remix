import db from "../db.server";

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
      songs: {
        connect: { id: song.id },
      },
    },
  });
}

export async function getUserPlaylists(userId: string) {
  return await db.playlist.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
    },
  });
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

