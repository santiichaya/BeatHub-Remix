export function convert_ms_h(time_ms: number, type = "song") {
  let duration = "";
  const time_s = time_ms / 1000;
  const hours = Math.trunc(time_s / 3600);
  const minutes = Math.trunc((time_s % 3600) / 60);
  if (hours === 0) {
    duration =
      type === "playlist"
        ? minutes + " min " + `0${Math.trunc(minutes % 60)}`.slice(-2) + " s"
        : minutes + ":" + `0${Math.trunc(minutes % 60)}`.slice(-2);
  } else {
    duration = hours + " h " + minutes + " min";
  }
  return duration;
}
