let adminToken: string | null = null;
let refreshToken: string | null = null;
let tokenExpiration: number | null = null;

export async function getSpotifyAdminToken() {
  const now = Date.now();

  if (adminToken && tokenExpiration && now < tokenExpiration) {
    return adminToken;
  }

  // Si el token expiró pero tenemos un refresh token, lo usamos para obtener uno nuevo
  if (refreshToken) {
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
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    });

    const jsonRes = await res.json();

    if (jsonRes.access_token) {
      adminToken = jsonRes.access_token;
      tokenExpiration = now + jsonRes.expires_in * 1000;
      return adminToken;
    }
  }

  return null;
}

export async function saveSpotifyAdminToken(access_token: string, refresh_token: string, expires_in: number) {
  adminToken = access_token;
  refreshToken = refresh_token;
  tokenExpiration = Date.now() + expires_in * 1000;
}

