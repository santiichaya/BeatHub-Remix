import { LoaderFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { getSpotifyAdminToken } from "~/.server/spotify";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const offset = parseInt(url.searchParams.get("offset") || "0");
  const token = await getSpotifyAdminToken();

  const artistResponse = await fetch(
    `https://api.spotify.com/v1/search?q=genre:pop&type=artist&limit=6&offset=${offset}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const artistData = await artistResponse.json();
  const playlistAdmin = await fetch(
    "https://api.spotify.com/v1/me/playlists?limit=6",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const response = await fetch("https://api.spotify.com/v1/me/player/devices", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const devices = await response.json();
  console.log(devices);
  const playListData = await playlistAdmin.json();
  return { artists: artistData.artists.items, offset, playlists: playListData.items, devices };
};

export default function InicioLayout() {
  return (
    <Outlet />
  );
}