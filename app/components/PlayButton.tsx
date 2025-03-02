import { useState, useEffect } from "react";

type PlayButtonProps = {
  accessToken: string;
  trackUri: string;
};

function PlayButton({ accessToken, trackUri }: PlayButtonProps) {
  const [player, setPlayer] = useState<Spotify.Player | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Inicializar el reproductor cuando el SDK esté listo
  useEffect(() => {
    const waitForSpotify = () => {
      return new Promise((resolve) => {
        if (window.Spotify) {
          resolve(window.Spotify);
        } else {
          window.onSpotifyWebPlaybackSDKReady = () => resolve(window.Spotify);
        }
      });
    };
  
    waitForSpotify().then((Spotify) => {
      const newPlayer = new Spotify.Player({
        name: "Mi BeatHub User",
        getOAuthToken: (cb) => cb(accessToken),
        volume: 0.5,
      });
  
      newPlayer.addListener("ready", async ({ device_id }) => {
        console.log("✅ Reproductor listo con device_id:", device_id);
        await transferPlaybackToDevice(device_id);
      });
  
      newPlayer.addListener("player_state_changed", (state) => {
        if (!state) return;
        console.log("🎵 Estado del reproductor cambiado:", state);
        setIsPlaying(!state.paused);
      });
  
      setPlayer(newPlayer);
      newPlayer.connect();
    });
  
  }, [accessToken]);

  // Transferir la reproducción al dispositivo del SDK
  const transferPlaybackToDevice = async (deviceId: string) => {
    try {
      const response = await fetch("https://api.spotify.com/v1/me/player", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          device_ids: [deviceId],
          play: false, // No empezar a reproducir automáticamente
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("⚠️ Error al transferir reproducción:", errorData);
      }
    } catch (error) {
      console.error("❌ Error en transferPlaybackToDevice:", error);
    }
  };

  // Reproducir la canción específica
  const playTrack = async () => {
    try {
      const response = await fetch("https://api.spotify.com/v1/me/player/play", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uris: [trackUri] }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("⚠️ Error al intentar reproducir la canción:", errorData);
      } else {
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("❌ Error en playTrack:", error);
    }
  };

  // Pausar / Reproducir con el botón
  const togglePlayPause = async () => {
    if (!player) {
      console.error("⚠️ El reproductor no está inicializado.");
      return;
    }
    await player.togglePlay();
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex items-center justify-center h-12 w-12">
      <button
        onClick={isPlaying ? togglePlayPause : playTrack}
        className="flex items-center justify-center h-10 w-10 bg-blue-500 rounded-full focus:outline-none"
      >
        {isPlaying ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-white" viewBox="0 0 16 16">
            <rect x="4" y="3" width="3" height="10" rx="1" />
            <rect x="9" y="3" width="3" height="10" rx="1" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-white" viewBox="0 0 16 16">
            <path d="M4 3.5v9l8-4.5-8-4.5z" />
          </svg>
        )}
      </button>
    </div>
  );
}

export default PlayButton;
