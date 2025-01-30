import { json, Links, Meta, Outlet, redirect, Scripts, useRouteError } from "@remix-run/react";
import type { ErrorResponse, LinksFunction, LoaderFunction } from "@remix-run/node";

import tailwindCSSURL from "./tailwind.css?url";
import Header from "./components/Header";

import Footer from "./components/Footer";

import { getCurrentUser } from "./utils/auth_server";
import { getSpotifyAdminToken} from "./.server/spotify";

export const loader: LoaderFunction = async ({ request }) => {
  const adminToken = await getSpotifyAdminToken();
  if (!adminToken) {
    // Construye la URL de autenticación de Spotify
    const SPOTIFY_AUTH_URL =
      "https://accounts.spotify.com/authorize?" +
      new URLSearchParams({
        response_type: "code",
        client_id: process.env.SPOTIFY_CLIENT_ID!,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
        scope: [
          "user-library-read",            // Leer la biblioteca del usuario
          "playlist-read-private",        // Leer playlists privadas
          "playlist-modify-private",      // Modificar playlists privadas
          "playlist-modify-public",       // Modificar playlists públicas
          "streaming",                    // Permitir la reproducción de música
          "user-read-playback-state",     // Leer el estado de la reproducción
          "user-follow-read",
          "user-modify-playback-state",   // Modificar el estado de la reproducción
        ].join(" "), // Une todos los scopes con un espacio
        state: "random_state_string", // Código aleatorio para proteger contra CSRF
      }).toString();

    return redirect(SPOTIFY_AUTH_URL);
  }
  const user = await getCurrentUser(request);
  return json(
    {
      isLoggedIn: user !== null
    }
  )
}

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwindCSSURL },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-primary min-h-screen flex flex-col">
        <div className="flex flex-col md:flex-row flex-grow">
          <Header />
          <main className="text-white md:ml-20 w-full h-fit">{children}</main>
        </div>
        <Footer />
        <Scripts />
      </body>
    </html>
  );
}




export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError() as ErrorResponse;

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-primary">
          <div className="text-center p-8 bg-secondary rounded-lg shadow-md">
            <h1 className="text-6xl font-bold text-gray-100 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-gray-100 mb-4">
              ¡Página no encontrada!
            </h2>
            {error.status == 404 &&
              <p className="text-black mb-8">
                Lo sentimos, la página que estás buscando no existe.
              </p>
            }
            <a
              href="/"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Volver al inicio
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}