
type PlayListProp = {
    name: string,
    url: string,
}
export function Playlist({ name, url }: PlayListProp) {

    return (
        <div className="flex h-[12rem] w-[12rem] p-1 mb-4 font-kanit justify-center items-center">
            <article>
                <img className="h-32 w-auto rounded-[10px]" src={url} alt='laksnd' />
                <div className='flex justify-center items-center'>
                    <h3 className="text-white text-2xl">{name}</h3>
                </div>
            </article>
        </div>
    )

}
