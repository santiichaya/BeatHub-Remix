import { Link, useLoaderData } from '@remix-run/react';
import logo from 'app/assets/onlyLogo.png'
import { HomeButton, LoginIcon, LogoutIcon, SearchIcon } from './icons';
import { loader } from '~/root';

function Header() {
    const data = useLoaderData<typeof loader>();
    return (
        <div className="bg-header flex flex-col items-center justify-between p-4 h-screen w-20 float-left">
            <Link to="/UserPage" className="flex flex-col items-center space-y-2">
                <img className="w-[3.75rem] h-[3.75rem]" src={logo} alt="logo" />
                <span className="font-kanit font-bold text-black">beathub</span>
            </Link>
            <div className="flex flex-col items-center space-y-10 mb-8">
                <Link to="/"><HomeButton /></Link>
                <Link to="/search"><SearchIcon /></Link>
                {data?.isLoggedIn ?
                    (<Link to="/logout"><LogoutIcon /></Link>)
                    :
                    (<Link to="/login"><LoginIcon /></Link>)}
            </div>
        </div>
    );
}

export default Header;
