import { Form } from '@remix-run/react';

const SearchBar: React.FC = () => {
    return (
        <Form method="get" action="/search">
            <input
                type="text"
                name="q"
                placeholder="Búsqueda de artista..."
                className='text-black focus:outline-none'
            />
        <button type="submit">Buscar</button>
        </Form>
    );
};

export default SearchBar;
