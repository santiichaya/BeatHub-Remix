import React from "react";

interface SearchResultsProps {
    artists: { id: string; name: string }[]
    albums: { id: string; name: string }[]
}

const SearchResults: React.FC<SearchResultsProps> = ({ artists, albums }) => {
    return (
        <div className="search-results">
            <h4>Artistas:</h4>
            {artists.length > 0 ? (
                artists.map(artist => (
                    <div key={artist.id}>
                        <p>{artist.name}</p>
                    </div>
                ))
            ) : (
                <p>No se encontraron artistas</p>
            )}

            <h4>Albums:</h4>
            {albums.length > 0 ? (
                albums.map(album => (
                    <div key={album.id}>
                        <p>{album.name}</p>
                    </div>
                ))
            ) : (
                <p>No se encontraron álbumes</p>
            )}
        </div>
    );
};

export default SearchResults;
