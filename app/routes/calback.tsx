import { LoaderFunction, redirect } from "@remix-run/node";
import { saveSpotifyAdminToken } from "~/.server/spotify";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const authCode = url.searchParams.get("code");

  if (!authCode) {
    return redirect("/");
  }

  // Intercambiamos el auth_code por access_token y refresh_token
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(
          process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET
        ).toString("base64"),
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: authCode,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
    }),
  });

  const jsonRes = await res.json();

  if (jsonRes.access_token && jsonRes.refresh_token) {
    // Guardamos los tokens para reutilizarlos en el backend
    await saveSpotifyAdminToken(jsonRes.access_token, jsonRes.refresh_token, jsonRes.expires_in);

    return redirect("/"); // Redirige a la home
  }

  return redirect("/");
};
