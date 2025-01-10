import { useLoaderData } from '@remix-run/react';
import SearchBar from '~/components/SearchBar';
import SearchResults from '~/components/SearchResults';
import { search } from '~/models/search.server';

export const loader = async ({ request }: { request: Request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get('q'); // Obtener el valor del parámetro `q`.

    if (!query) return { artists: [], albums: [] };

    const result = await search(query); // Llamada a la función de búsqueda.
    return {
        artists: result.artists.items,
        albums: result.albums.items,
    };
};

export default function SearchPage() {
    const { artists, albums } = useLoaderData<typeof loader>();

    return (
        <div className="search-page">
            <SearchBar />
            <SearchResults artists={artists} albums={albums} />
        </div>
    );
}
