import { getSpotifyToken } from "~/.server/spotify";

export async function artist(q: string, offset: number) {
    const token = await getSpotifyToken();

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