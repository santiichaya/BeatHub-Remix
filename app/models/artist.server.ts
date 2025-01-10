import { PrismaClient } from "@prisma/client"; 

import { getSpotifyToken } from "~/.server/spotify"; 
// Importa la función `getSpotifyToken` que obtiene un token de autenticación para la API de Spotify.

const db = new PrismaClient(); 

export async function searchArtists(q: string) { 
    //Función asincrónica llamada `searchArtists` que recibe un término de búsqueda `q` como parámetro.

    const token = await getSpotifyToken(); 
    // Llama a `getSpotifyToken` para obtener un token de autenticación necesario para acceder a la API de Spotify.

    const res = await fetch(`https://api.spotify.com/v1/search?q=${q}&type=artist&limit=10`, { 
        //Solicitud HTTP `GET` al endpoint de búsqueda de Spotify para buscar artistas con el término `q`.
        method: 'GET', 
        headers: { 'Authorization': 'Bearer ' + token }, 
        // Incluye el token de autenticación en los encabezados de la solicitud.
    });

    const jsonRes = await res.json(); 
    // Convierte la respuesta de la API a formato JSON.

    if (!('artists' in jsonRes)) { return []; } 
    // Verifica si el campo `artists` existe en la respuesta. Si no existe, devuelve un arreglo vacío.

    if (!('items' in jsonRes.artists)) { return []; } 
    // Verifica si el campo `items` existe dentro de `artists`. Si no existe, devuelve un arreglo vacío.

    return jsonRes.artists.items; 
    // Devuelve array de artistas encontrados en la respuesta.
}
/* import { PrismaClient } from "@prisma/client";

const db = new PrismaClient()

export function getAllArtists() {
    return db.user.findMany({
        orderBy: {
            id: "asc",
        }
    });
} */

// export function getUserById(query: string | null) {
//     return db.user.findUnique({
//         where: {
//             id: {
//                 contains: query ?? null,
//                 mode: "insensitive",
//             }
//         }
//     }
//     );
// }
