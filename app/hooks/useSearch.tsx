// src/hooks/useSearch.tsx:
import { useState, useEffect } from 'react';
import {resultsong, resultartist } from '../data/repoMusica';
import {getAllArtists,getArtistById} from '~/models/artist.server'
import { getAllSongs,getSongById } from '~/models/song.server';

export function useSearch(query: string) {
    const [songs, setSongs] = useState<resultsong[]>([]);
    const [artists, setArtists] = useState<resultartist[]>([]);

    useEffect(() => {
        if (query.length > 0) {
            const lowercasedQuery = query.toLowerCase();
            
            // Filtrar canciones que coincidan con el título
            const filteredSongs = getAllSongs().filter((song: { title: string; }) =>
                song.title.toLowerCase().includes(lowercasedQuery)
            );

            // Filtrar artistas que coincidan con el nombre
            const filteredArtists = getAllArtists().filter((artist: { name: string; }) =>
                artist.name.toLowerCase().includes(lowercasedQuery)
            );

            // Agregar canciones de los artistas encontrados
            const artistIds = filteredArtists.map(artist => artist.id);
            const artistSongs = getSongs().filter(song => artistIds.includes(song.artist_id));

            // Combinar canciones filtradas por título con las canciones de los artistas encontrados
            const combinedSongs = [...new Set([...filteredSongs, ...artistSongs])];

            setSongs(combinedSongs);
            setArtists(filteredArtists);
        } else {
            setSongs([]);
            setArtists([]);
        }
    }, [query]);

    return { songs, artists };
}
