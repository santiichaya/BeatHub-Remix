import { Link } from "@remix-run/react";
import { NextPage, PreviousPage } from "./icons";

interface SearchResultsProps {
  artists: { id: string; name: string }[];
  albums: { id: string; name: string }[];
  tracks: { id: string; name: string; artist: string }[];
  offset: number;
  limit: number;
  query: string;
  type: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  artists,
  albums,
  tracks,
  offset,
  limit,
  query,
  type,
}) => {
  // Divide los tipos seleccionados (ejemplo: "artist,album")
  const selectedTypes = type.split(",");

  // Calcula el total sumando los elementos de cada tipo seleccionado
  const total = selectedTypes.reduce((sum, currentType) => {
    if (currentType === "artist") return sum + artists.length;
    if (currentType === "album") return sum + albums.length;
    if (currentType === "track") return sum + tracks.length;
    return sum; // Si el tipo no coincide, lo ignora
  }, 0);

  const currentPage = Math.floor(offset / limit) + 1; // Página actual comienza en 1
  const totalPages = Math.ceil(total / limit); // Total de páginas

  return (
    <div className="search-results">
      <div className="pagination">
        <button disabled={offset === 0}>
          <Link
            to={`?q=${encodeURIComponent(query)}&type=${type}&offset=${Math.max(
              offset - limit,
              0
            )}&limit=${limit}`}
          >
            {offset > 0 && <PreviousPage />}
          </Link>
        </button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <button disabled={currentPage === totalPages}>
          <Link
            to={`?q=${encodeURIComponent(query)}&type=${type}&offset=${
              offset + limit
            }&limit=${limit}`}
          >
            {currentPage < totalPages && <NextPage />}
          </Link>
        </button>
      </div>
    </div>
  );
};

export default SearchResults;
