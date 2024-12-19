import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getAllArtists } from "~/models/artist.server";

export const loader = async () => {
    const artist = await getAllArtists()
    return {
        persona: "Paco"
    }
};

export default function SearchPage() {
    const { persona } = useLoaderData<typeof loader>()

    return (
        <>
            <h1>Página de búsqueda</h1>
            <p>{persona}</p>
        </>
    )
}
