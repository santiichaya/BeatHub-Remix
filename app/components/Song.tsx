import PlayButton from "./PlayButton";
import { convert_ms_h } from "~/utils/convert_time";

type SongData = {
  id: string
  title: string;
  artist: string;
  name_album: string;
  photo: string;
  duration: number;
  url: string;
};

type SongsProps = {
  token: string;
  deviceId:string;
  showOnlyPlayButton?: boolean;
  songData: SongData;
};

export function Song({ token,deviceId,showOnlyPlayButton = false, songData }: SongsProps) {
  return (
    <article
      className={`${showOnlyPlayButton
          ? "h-16 flex items-center justify-end bg-transparent p-0 m-0"
          : "h-12 w-[98%] flex justify-between bg-[#247BA0] rounded-lg overflow-hidden m-2"
        }`}
    >
      {!showOnlyPlayButton && (
        <>
          <header className="w-4/5 flex items-center">
            <img src={songData.photo} className="h-12 rounded-lg" alt={`${songData.title} cover`} />
            <div className="h-full w-4/5 flex items-center pl-4">
              <h3 className="w-[35%] text-start">{songData.title}</h3>
              <p className="text-sm font-light w-[40%] text-start">{songData.artist}</p>
              <p className="text-xs font-light w-[25%] text-start">{songData.name_album}</p>
            </div>
          </header>
          <footer className="w-1/5 flex justify-around items-center">
            <p className="text-sm font-thin">{convert_ms_h(songData.duration)}</p>
            <PlayButton trackUri={songData.url} accessToken={token} deviceId={deviceId} />
          </footer>
        </>
      )}

      {showOnlyPlayButton && (
        <footer className="mr-8 h-24 w-24 flex items-center justify-center">
          <PlayButton trackUri={songData.url} accessToken={token} deviceId={deviceId} />
        </footer>
      )}
    </article>
  );
}

export default Song;
