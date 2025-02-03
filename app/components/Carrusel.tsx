import { useLoaderData, Link } from "@remix-run/react";
import { loader } from "~/routes/inicio.index";

export default function Index() {
  const { artists, offset } = useLoaderData<typeof loader>();

  return (
    <div className="carousel">
      <h1>Artistas Populares</h1>
      <div className="artist-list">
        {artists.map((artist: any) => (
          <div key={artist.id} className="artist-card">
            <img src={artist.images[0]?.url} alt={artist.name} />
            <h3>{artist.name}</h3>
          </div>
        ))}
      </div>

      <div className="pagination">
        {offset > 0 && (
          <Link to={`/?offset=${offset - 6}`} className="prev-button">
            Anterior
          </Link>
        )}
        <Link to={`/?offset=${offset + 6}`} className="next-button">
          Siguiente
        </Link>
      </div>
    </div>
  );
}
