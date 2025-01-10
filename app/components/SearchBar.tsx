import { useState } from 'react';
import { useFetcher } from '@remix-run/react';

const SearchBar: React.FC = () => {
    const [query, setQuery] = useState('');
    const fetcher = useFetcher();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    return (
        <fetcher.Form method="get" action="/search">
            <input
                type="text"
                name="q"
                value={query}
                onChange={handleInputChange}
                placeholder="Búsqueda de artista..."
            />
            <button type="submit">Buscar</button>
        </fetcher.Form>
    );
};

export default SearchBar;
