import { NavLink } from "@remix-run/react"

type PlayListProp = {
    id: string,
    name: string,
    url: string,
}
export function Playlist({ name, url, id }: PlayListProp) {
    return (
        <NavLink reloadDocument to={
            {
                pathname: `../inicio/playlist/${id}`,
            }
        } className={"md:h-20 sm:h-16 lg:w-[26%] lg:m-8 lg:h-24 w-[40%] m-4 h-12"}>
                <article className="flex bg-gray-800 rounded-[10px]">
                    <img className="h-12 md:h-20 sm:h-16 lg:h-24 w-auto rounded-l-[10px] lg:mr-4 mr-2" src={url} alt='laksnd' />
                    <div className='flex justify-center items-center'>
                        <h3 className="text-text-secondary text-xs lg:text-xl sm:text-md md:text-lg">{name}</h3>
                    </div>
                </article>
        </NavLink >
    )

}
