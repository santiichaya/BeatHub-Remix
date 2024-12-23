import { useLoaderData } from "@remix-run/react";
import { searchArtists } from "~/models/artist.server";

interface Artist { // Al menos esto de momento pa que no se queje.
    id: string
    name: string 
}

export const loader = async () => {
    const artists: Artist[] = await searchArtists('Paco')
    console.log(artists)
    return { artists }
};

export default function SearchPage() {
    const { artists } = useLoaderData<typeof loader>()

    return (
        <>
            <h1>Página de búsqueda. Prueba con artistas por 'Paco'</h1>
            <ul>
                {artists.map(a => <li key={a.id}>{a.name}</li>)}
            </ul>
        </>
    )
}
