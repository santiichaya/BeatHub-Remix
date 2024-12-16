import { Song } from "../components/Song";
import data from '../data/data.json';
import { getPlaylistById, getSongById } from "../data/repoMusica"
import { useParams } from "react-router-dom";

export function Display() {
    const { id } = useParams(); // Obtener el ID de la URL
    const idPlayList = Number(id); // Convertir a número
    const playlist = getPlaylistById(idPlayList);
    const canciones = data.songs;
    let tiempo_total = 0;
    //Para saber el tiempo total de la PlayList
    playlist?.songs.map((id) => {
        const cancion = getSongById(id);
        tiempo_total = tiempo_total + cancion!.duration;
    })
    const horas = Math.trunc(tiempo_total / 3600);
    const minutos = `0${Math.trunc((tiempo_total % 3600) / 60)}`;

    const duracionPlayList = horas != 0 ? `${horas} h : ${minutos.slice(-2)} min` : `${minutos.slice(-2)} min`;
    return (
        <div className="display-container">
            <div className="display-container-background" style={{ backgroundImage: `url(${playlist?.url})` }}></div>
            <div className="displayPlaylist-header">
                <h3>{playlist?.name}</h3>
                <p>{duracionPlayList}</p>
            </div>
            <table className="displayPlaylist-content">
                <thead className="display-table-head">
                    <tr className="display-table-header">
                        <td className="display-table-header-info">
                            <div className="display-table-header-div1">
                            <span className="display-table-header-vacio"></span>
                                <div className="display-table-header-stuff">
                                    
                                    <span className="display-table-header-title">Titulo</span>
                                    <span className="display-table-header-artist">Artista</span>
                                    <span className="display-table-header-genre">Género</span>
                                </div>
                            </div>
                            <div className="display-table-header-div2">
                                    <span className="display-table-header-duration">Duración</span>
                                </div>
                        </td>
                    </tr>
                </thead>
                <tbody className="display-table-body">
                    {playlist?.songs.map((v: number) => (
                        <tr key={canciones[v - 1].id}><td><Song id={canciones[v - 1].id} /></td></tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}