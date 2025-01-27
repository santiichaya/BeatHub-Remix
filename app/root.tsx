import { json, Links, Meta, Outlet, Scripts, useRouteError } from "@remix-run/react";
import type { ErrorResponse, LinksFunction, LoaderFunction } from "@remix-run/node";

import tailwindCSSURL from "./tailwind.css?url";
import Header from "./components/Header";
import Footer from "./components/Footer";

import { getCurrentUser } from "./utils/auth_server";

export const loader: LoaderFunction = async ({ request }) => {
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
      <body className="bg-primary min-h-screen">
        <div className="flex flex-col md:flex-row">
            <Header />
          <main className=" text-white md:ml-20 w-full h-fit" >
            {children}
          </main>
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