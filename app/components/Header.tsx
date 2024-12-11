import { Link } from 'react-router-dom';
import HomeButton from './HomeButton.js';
import SearchButton from './SearchButton.js';

function Header() {
    return (
        <div className="p-4 flex fixed bg-header w-full top-0 left-0 z-1000">
            <Link to="/UserPage" className='user-button'>
                <img className="w-[3.75rem] h-[3.75rem]" src="app/assets/onlyLogo.png" alt="logo" />
                <span className="font-kanit font-bold">beathub</span>
            </Link>
            <Link to="/"><HomeButton /></Link>
            <Link to="/search"><SearchButton /></Link>
        </div >
    );
}

export default Header;
