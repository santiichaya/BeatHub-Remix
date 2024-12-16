/* import { getPlaylistById } from "../data/repoMusica" */
import {Link} from 'react-router-dom';

type PlayListProp = {
    id: number;
}
export function Playlist({ id }: PlayListProp) {
    /* const playlist = getPlaylistById(id); */

    return (
        <div className="flex h-[12rem] w-[12rem] p-1 mb-4 font-kanit justify-center items-center">
            <Link to={`/Playlist/${id}`} className="no-underline">
                <article>
                    <img className="h-32 w-auto rounded-[10px]" src="https://easy-peasy.ai/cdn-cgi/image/quality=80,format=auto,width=700/https://fdczvxmwwjwpwbeeqcth.supabase.co/storage/v1/object/public/images/a8cb5764-e3b2-4db9-bf2d-8022256ec2a7/114f6e84-5185-4b60-8eba-7e7122039640.png" alt='laksnd'/>
                    <div className='flex justify-center items-center'>
                        <h3 className="text-white text-2xl">Variety</h3>
                    </div>
                </article>
            </Link>
        </div>
    )

}
