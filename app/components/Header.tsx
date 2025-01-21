import { Link } from '@remix-run/react';
import HomeButton from './HomeButton.js';
import SearchButton from './SearchButton.js';

import logo from 'app/assets/onlyLogo.png'

function Header() {
    return (
        <div className="bg-header w-full mb-4 md:w-20 md:h-full flex sm:flex-row md:flex-col items-center justify-between p-4 h-[7rem] md:fixed">
            <Link to="/UserPage" className="flex flex-col items-center space-y-2">
                <img className="w-[3.75rem] h-[3.75rem]" src={logo} alt="logo" />
                <span className="font-kanit font-bold text-black">beathub</span>
            </Link>
            <div className="flex flex-row md:flex-col items-center justify-center md:space-y-10">
                <Link to="/"><HomeButton /></Link>
                <Link to="/search"><SearchButton /></Link>
            </div>
        </div>
    );
}

export default Header;
