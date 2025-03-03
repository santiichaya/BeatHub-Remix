import { LoaderFunction } from "@remix-run/node";
import { getSpotifyAdminToken } from "~/.server/spotify";
import { fetchWithRetry } from "~/utils/fetchWithRetry";
import {Outlet} from "@remix-run/react";
import { commitSession, getSession } from "~/utils/session";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const offset = parseInt(url.searchParams.get("offset") || "0");
  const cookie=request.headers.get("cookie");
  const session=await getSession(cookie);
  const token = await getSpotifyAdminToken();
  const claveArtista=`https://api.spotify.com/v1/search?q=genre:pop&type=artist&limit=6&offset=${offset}`;
  const clavePlaylist="https://api.spotify.com/v1/me/playlists?limit=6";
  if(session.get(claveArtista)==null){
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const artistData = await fetchWithRetry(`https://api.spotify.com/v1/search?q=genre:pop&type=artist&limit=6&offset=${offset}`, options);
    session.set(claveArtista,artistData.artists.items);
  }
  
  //console.log(session.data)
  if(session.get(clavePlaylist)==null){
    const playlistAdmin = await fetch(
      "https://api.spotify.com/v1/me/playlists?limit=6",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const playListData = await playlistAdmin.json();
    session.set(clavePlaylist,playListData.items);
  }
  await commitSession(session);
  return { artists: session.get(claveArtista), offset, playlists: session.get(clavePlaylist)};
};



  export default function InicioLayout() {
    return (
      <Outlet/>
    );
  }

