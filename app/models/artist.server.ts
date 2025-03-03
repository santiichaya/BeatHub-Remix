import { getSpotifyAdminToken } from "~/.server/spotify";
import db from "../db.server";
import { handleDelete } from "./utils";

export async function artist(q: string, offset: number) {
    const token = await getSpotifyAdminToken();

    const query = new URLSearchParams({
        q: q,
        type: 'artist',
        limit: '6',
        offset: offset.toString() //Para la paginación
    })
    const res = await fetch(`https://api.spotify.com/v1/artists?${query}`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + token },
    });

    // https://developer.spotify.com/documentation/web-api/reference/search
    return await res.json();
}


export async function getFollowedArtists(userId: string) {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        likedArtists: {
          select: {
            id: true,
            name: true,
            apiId: true,
            photo_artist: true,
          },
        },
      },
    });
  
    return user?.likedArtists || [];
  }

export async function isFollowingArtist(userId: string, apiId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      likedArtists: {
        where: { apiId },
        select: { id: true },
      },
    },
  });

  return (user?.likedArtists ?? []).length > 0;
}

export async function addArtistToLikes(userId: string, apiId: string, name: string, photo_artist: string) {
  const artist = await db.artist.upsert({
    where: { apiId },
    update: {},
    create: {
      name,
      apiId,
      photo_artist,
    },
  });

  await db.user.update({
    where: { id: userId },
    data: {
      likedArtists: { connect: { id: artist.id } },
    },
  });
}


export async function removeArtistFromLikes(userId: string, apiId: string) {
    const artist = await db.artist.findUnique({
      where: { apiId },
      select: { id: true },
    });
  
    if (!artist) return; 
  
    await db.user.update({
      where: { id: userId },
      data: { likedArtists: { disconnect: { id: artist.id } } },
    });
  
    const stillLiked = await db.user.findFirst({
      where: { likedArtists: { some: { id: artist.id } } },
    });
  
    if (!stillLiked) {
      await handleDelete(() => db.artist.delete({ where: { id: artist.id } }));
    }
  }
  

