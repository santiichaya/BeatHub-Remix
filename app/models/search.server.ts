import { getSpotifyToken } from "~/.server/spotify";

export async function search(q: string, type: string = 'artist,album,tracks', offset: number = 0, limit: number = 20) {
    const token = await getSpotifyToken();

    const query = new URLSearchParams({
        q,
        type,
        limit: limit.toString(),
        offset: offset.toString(),
    });

    const res = await fetch(`https://api.spotify.com/v1/search?${query}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
    });

    return await res.json();
}
