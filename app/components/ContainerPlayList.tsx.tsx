import { Playlist } from "./Playlist";
/* import data from "../data/data.json"; */

/* type ContainerPlayListProp = {
    ids: number[];
} */

export function ContainerPlayList(/* { }: ContainerPlayListProp */) {
    /* const playlists = data.playlists; */

    return (
        <div className="ml-28 bg-secondary h-auto mt-8 mr-8 rounded-[30px] pt-4">
            <h1 className="m-0 text-5xl font-bold ml-4">Playlists</h1>
                <Playlist key="x-1" id={2} />
        </div>
    )

}