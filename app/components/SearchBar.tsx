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
                className='text-primary'
            />
            <button type="submit">Buscar</button>
        </Form>
    );
};

export default SearchBar;
