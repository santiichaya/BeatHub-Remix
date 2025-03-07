import { Link, useLoaderData } from '@remix-run/react';
import logo from 'app/assets/onlyLogo.png'
import { HomeButton, LoginIcon, LogoutIcon, MyMusic, SearchIcon } from './icons';
import { loader } from '~/root';


function Header() {
    const data = useLoaderData<typeof loader>();
    return (
        <div className="bg-header w-full mb-4 md:w-20 md:h-full flex sm:flex-row md:flex-col items-center justify-between p-4 h-[7rem] md:fixed">
            <div className="flex flex-col items-center space-y-2">
                <img className="w-[3.75rem] h-[3.75rem]" src={logo} alt="logo" />
                <span className="font-kanit font-bold text-black">beathub</span>
            </div>
                <Link to="/library"><MyMusic/></Link>
                <Link to="/"><HomeButton /></Link>
                <Link to="/search" ><SearchIcon /></Link>
                {data?.isLoggedIn ?
                    (<Link to="/logout"><LogoutIcon /></Link>)
                    :
                    (<Link to="/login"><LoginIcon /></Link>)}
        </div>
    );
}

export default Header;
