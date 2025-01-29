import { getSpotifyAdminToken } from "~/.server/spotify";

export async function search(q: string) {
    const token = await getSpotifyAdminToken();

    const query = new URLSearchParams({
        q: q,
        type: 'artist,album,playlist',
        limit: '10'
    })
    const res = await fetch(`https://api.spotify.com/v1/search?${query}`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + token },
    });

    // https://developer.spotify.com/documentation/web-api/reference/search
    return await res.json();
}