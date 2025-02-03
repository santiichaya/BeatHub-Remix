import { useState, useEffect } from "react";

type PlayButtonProps = {
  trackUri: string;
  accessToken: string;
  deviceId:string;
}
function PlayButton({ trackUri, accessToken,deviceId }: PlayButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const onPlay = () => {
    setIsPlaying((prev) => !prev); // Cambiar el estado al hacer clic
  };

  useEffect(() => {

    const playTrack = async () => {
      try {
        const response = await fetch("https://api.spotify.com/v1/me/player/play", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uris: [trackUri], // Pista que se va a reproducir
            device_ids: [deviceId], // Dispositivo en el que se va a reproducir
          }),
        });

        if (!response.ok) {
          throw new Error("Error al reproducir la pista");
        }
        console.log("Reproducción iniciada");
      } catch (error) {
        console.error(error);
      }
    };

    const pauseTrack = async () => {
      try {
        const response = await fetch("https://api.spotify.com/v1/me/player/pause", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          }
        });

        if (!response.ok) {
          throw new Error("Error al pausar la pista");
        }
        console.log("Reproducción pausada");
      } catch (error) {
        console.error(error);
      }
    };

    if (isPlaying) {
      playTrack();
    } else {
      pauseTrack();
    }
  }, [accessToken, deviceId, isPlaying, trackUri]);

  return (
    <div className="flex items-center justify-center h-12 w-12">
      <button
        onClick={onPlay}
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
