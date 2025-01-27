type ArtistProps = {
    id:string | number,
    name: string;
    profile_image?: string;
  };

  
  
  export function Artist({ name, profile_image }: ArtistProps) {
    return (
      <div className="artist">
        <img
          className="artist-img"
          src={profile_image || ""}
          alt={name || "Artista no encontrado"}
        />
        <span className="artist-name">{name || "Artista no encontrado"}</span>
      </div>
    );
  }
  