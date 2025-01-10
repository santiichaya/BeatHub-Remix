import { Link } from 'react-router-dom';
import HomeButton from './HomeButton.js';
import SearchButton from './SearchButton.js';

import logo from '../assets/onlyLogo.png'

function Header() {
    return (
        <div className="fixed hidden bg-header h-full w-auto top-0 left-0 z-1000 flex flex-col items-center justify-between p-4">
            <Link to="/UserPage" className="flex flex-col items-center space-y-2">
                <img className="w-[3.75rem] h-[3.75rem]" src="app/assets/onlyLogo.png" alt="logo" />
                <span className="font-kanit font-bold">beathub</span>
            </Link>
            <div className="flex flex-col items-center space-y-10 mb-8">
                <Link to="/"><HomeButton /></Link>
                <Link to="/search"><SearchButton /></Link>
            </div>
        </div>
    );
}

export default Header;
