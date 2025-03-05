import { NavLink } from "@remix-run/react";

type ArtistProps = {
  id: string | number;
  name: string;
  profile_image: string;
  offset?: number;
};

export function Artist({ id, name, profile_image, offset = 0 }: ArtistProps) {

  return (
      <NavLink reloadDocument to={{ pathname: `../inicio/artist/${id}/${offset}` }}>
        <div>
          <img
            src={profile_image || ""}
            alt={name || "Artista no encontrado"}
            className="w-[100%] aspect-square"
          />
          <span className="artist-name">{name || "Artista no encontrado"}</span>
        </div>
      </NavLink>
  );
}
