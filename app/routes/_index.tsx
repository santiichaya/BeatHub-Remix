import { useLoaderData, useFetcher, Link } from "@remix-run/react";
import { ActionFunction, LoaderFunction } from "@remix-run/node";
import React from "react";
import { getSpotifyToken } from "~/.server/spotify";
import { User } from "@prisma/client";
import { createUser, deleteUser, getAllUsers } from "../models/user.server";
import { generate_hash } from "~/utils/hash";
import { getSession } from "~/utils/session";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const offset = parseInt(url.searchParams.get("offset") || "0");

  const token = await getSpotifyToken();
  const artistResponse = await fetch(
    `https://api.spotify.com/v1/search?q=genre:pop&type=artist&limit=6&offset=${offset}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const artistData = await artistResponse.json();

  const users = await getAllUsers();
  const cookieHeader = request.headers.get("cookie");
  const session = await getSession(cookieHeader);

  return { artists: artistData.artists.items, offset, users, session };
};

export const action: ActionFunction = async ({ request }) => {
  const datosFormulario = await request.formData();
  switch (datosFormulario.get("_action")) {
    case "crear": {
      const username = datosFormulario.get("username") as string;
      const email = datosFormulario.get("email") as string;
      const password = datosFormulario.get("password") as string;
      const passwordHash = await generate_hash(password);
      return createUser(username, passwordHash, email);
    }
    case "eliminar": {
      const id = Number(datosFormulario.get("id_usuario"));
      return deleteUser(id);
    }
    default: {
      return null;
    }
  }
};

export default function Index() {
  const { artists, offset, users, session } = useLoaderData<typeof loader>();
  const createUserFetcher = useFetcher();

  return (
    <React.Fragment>
      {/* Formulario de creación de usuario */}
      <createUserFetcher.Form method="post">
        <input type="text" name="username" />
        <input type="password" name="password" />
        <input type="email" name="email" />
        <input type="submit" name="_action" />
      </createUserFetcher.Form>

      {/* Sesión del usuario */}
      <div>
        <h2>Bienvenido a BeatHub {session.data.username}</h2>
        <h3>El id del usuario que sea registrado es: {session.data.userId}</h3>
      </div>

      {/* Lista de usuarios */}
      <div>
        <h3>El usuario que tenemos ahora mismo es:</h3>
        {users.map((user: User) => (
          <React.Fragment key={user.id}>
            <ul>
              <li>Username: {user.username}</li>
              <li>Email: {user.email}</li>
              <li>Fecha de Registro: {new Date(user.createdAt).toLocaleDateString()}</li>
              <li>Tiempo en la aplicación: {user.time}</li>
              <li>Canción Favorita: {user.favoriteSongId}</li>
            </ul>
            <createUserFetcher.Form method="post">
              <button type="submit" name="_action" value="eliminar">
                Eliminar
              </button>
              <input type="hidden" name="id_usuario" value={user.id} />
            </createUserFetcher.Form>
          </React.Fragment>
        ))}
      </div>

      {/* Carrusel de Artistas */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Artistas Populares</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {artists.map((artist: any) => (
            <div
              key={artist.id}
              className="p-4 bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <img
                src={artist.images[0]?.url}
                alt={artist.name}
                className="w-24 h-24 mx-auto rounded-full object-cover mb-4"
              />
              <h3 className="text-lg font-medium text-white text-center">{artist.name}</h3>
            </div>
          ))}
        </div>

        {/* Botones de Paginación */}
        <div className="flex justify-between max-w-sm mx-auto mt-6">
          {offset > 0 && (
            <Link
              to={`/?offset=${offset - 6}`}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Anterior
            </Link>
          )}
          <Link
            to={`/?offset=${offset + 6}`}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Siguiente
          </Link>
        </div>
      </div>
    </React.Fragment>
  );
}
