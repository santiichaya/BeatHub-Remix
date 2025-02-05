import { LoaderFunction } from "@remix-run/node";
import { useLoaderData, useMatches } from "@remix-run/react";
import { getSpotifyAdminToken } from "~/.server/spotify";
import Song from "~/components/Song";
import { convert_ms_h } from "~/utils/convert_time";

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
  let duration_ms = 0;
  playlistData.items.forEach((item: any) => {
    canciones.push(item.track);
    duration_ms = duration_ms + item.track.duration_ms;
  });
  return { canciones, id: params.id, duration_ms, token };
};

export default function Playlist() {
  const { canciones, id, duration_ms, token } = useLoaderData<typeof loader>();
  const matches = useMatches(); //El hook useMatches sirve para poder obtener datos de las rutas padres desde las rutas hijas sin tener que pasar props manualmente, muy parecido al useContext().
  const datosplaylists = matches.find(match => match.id === 'routes/inicio')?.data; //Siempre es mejor utilizar match.id ya que es el identificador único de la ruta, el cual Remix genera automáticamente a partir de la estructura de archivos de mi proyecto.
  let datosplaylist = datosplaylists.playlists.filter((playlist: any) => {
    return playlist.id === id;
  });
  datosplaylist = datosplaylist[0];
  const duration = convert_ms_h(duration_ms, datosplaylist.type);
  return (
    <div>
      <div>
        <img src={datosplaylist.images[0].url} className="h-12 rounded-lg" alt={`${datosplaylist.name} cover`} />
        <div>
          <p>Lista</p>
          <h1>{datosplaylist.name}</h1>
          <p>{datosplaylist.description}</p>
          <p>{`${datosplaylist.owner.display_name}. ${datosplaylist.tracks.total} canciones ${duration} aproximadamente`}</p>
        </div>
      </div>
      <div>
        <ul>
          {canciones.map((cancion: any) => {
            let artistas = cancion.artists.map((artista: any) => {
              return artista.name;
            });
            artistas = artistas.length === 1 ? artistas[0] : artistas.slice(0, -1).join(", ") + " y " + artistas[artistas.length - 1];
            return <li key={cancion.id}>
              <Song token={token} deviceId={datosplaylists.devices.devices[0]?.id} songData={{
                id: cancion.id,
                title: cancion.name,
                artist: artistas,
                name_album: cancion.album.name,
                photo: cancion.album.images[0].url,
                duration: cancion.duration_ms,
                url: cancion.uri
              }}></Song>
            </li>
          })}
        </ul>
      </div>
    </div>
  );
}