import { useState, useEffect } from "react";
import { Form, useSearchParams } from "@remix-run/react";

interface SearchBarProps {
    initialQuery?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ initialQuery = "" }: SearchBarProps) => {
    const [query, setQuery] = useState<string>(initialQuery);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        setQuery(searchParams.get("q") || "");
    }, [searchParams]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    return (
        <Form method="get" action="/search" className="search-bar flex items-center gap-2">
            <input
                type="text"
                name="q"
                value={query}
                onChange={handleInputChange}
                placeholder="Buscar en BeatHub..."
                className="text-primary border p-2 rounded-lg w-full"
            />
            <button type="submit" className="p-2 bg-blue-500 text-white rounded-lg">
                🔍
            </button>
        </Form>
    );
};

export default SearchBar;
