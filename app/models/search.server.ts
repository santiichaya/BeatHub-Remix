import { getSpotifyAdminToken } from "~/.server/spotify";

export async function search(q: string, type: string = "artist,track", offset: number = 0, limit: number = 10) {
  const token = await getSpotifyAdminToken();

  const queryParams = new URLSearchParams({
    q,
    type,
    limit: limit.toString(),
    offset: offset.toString(),
  });

  const res = await fetch(`https://api.spotify.com/v1/search?${queryParams}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  return await res.json();
}
