interface AlbumProps {
  id: string | number | bigint; 
  name: string;
}

const Album: React.FC<AlbumProps> = ({ id, name }) => {
  return (
    <div className="album-item">
      <p>{name}</p>
    </div>
  );
};

export default Album;
