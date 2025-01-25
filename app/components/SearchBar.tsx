import { useState } from 'react';
import { Form } from '@remix-run/react';

const SearchBar: React.FC = () => {
    const [query, setQuery] = useState('');
    const [type, setType] = useState('artist,album,track'); // Valor predeterminado

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setType(e.target.value);
    };

    return (
        <Form method="get" action="/search">
            <input
                type="text"
                name="q"
                value={query}
                onChange={handleInputChange}
                placeholder="Búsqueda..."
            />
            <select name="type" value={type} onChange={handleTypeChange}>
                <option value="artist,album,track">Todo</option>
                <option value="artist">Artistas</option>
                <option value="album">Álbumes</option>
                <option value="track">Canciones</option>
            </select>
            <button type="submit">Buscar</button>
        </Form>
    );
};

export default SearchBar;
