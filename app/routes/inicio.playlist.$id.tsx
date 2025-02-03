import { LoaderFunction } from "@remix-run/node";
import { useLoaderData, useMatches } from "@remix-run/react";
import { getSpotifyAdminToken } from "~/.server/spotify";
import Song from "~/components/Song";

export const loader: LoaderFunction = async ({ params }) => {
  const token = await getSpotifyAdminToken();
  const playlistResponse = await fetch(`https://api.spotify.com/v1/playlists/${params.id}/tracks`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const playlistData = await playlistResponse.json();
  const canciones: Array<any> = [];
  playlistData.items.forEach((item: any) => {
    console.log(item.track.artists);
    canciones.push(item.track);
  });
  return { canciones };
};

export default function Playlist() {
  const { canciones } = useLoaderData<typeof loader>();
  const matches = useMatches(); //El hook useMatches sirve para poder obtener datos de las rutas padres desde las rutas hijas sin tener que pasar props manualmente, muy parecido al useContext().
  const datosplaylists = matches.find(match => match.id === 'routes/inicio')?.data; //Siempre es mejor utilizar match.id ya que es el identificador único de la ruta, el cual Remix genera automáticamente a partir de la estructura de archivos de mi proyecto.

  return (
    <>
      <ul>
        {canciones.map((cancion: any) => {
          let artistas = cancion.artists.map((artista: any) => {
            return artista.name;
          });
         artistas= artistas.length===1 ? artistas[0] : artistas.slice(0,-1).join(" ,")+" y "+artistas[artistas.length-1];
          return <li key={cancion.id}>
            <Song id={cancion.id} songData={{
              id: cancion.id, 
              title: cancion.name,
              artist: artistas,
              realease_date: cancion.realease_date,
              photo: cancion.album.images[0].url,
              duration: cancion.duration_ms,
              url: cancion.uri
            }}></Song>
          </li>
        })}
      </ul>
    </>
  );
}