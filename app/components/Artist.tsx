import { NavLink } from "@remix-run/react";

type ArtistProps = {
  id: string | number;
  name: string;
  profile_image: string;
  offset?: number;
};

export function Artist({ id, name, profile_image, offset = 0 }: ArtistProps) {

  return (
      <NavLink reloadDocument to={{ pathname: `artist/${id}/${offset}` }}>
        <div className="artist">
          <img
            className="artist-img"
            src={profile_image || ""}
            alt={name || "Artista no encontrado"}
          />
          <span className="artist-name">{name || "Artista no encontrado"}</span>
        </div>
      </NavLink>
  );
}
