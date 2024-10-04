import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'; // Importa los íconos

const Header = () => {
    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login'; // Redirigir al login
    };

    return (
        <header className="bg-blue-400 text-white p-4 flex justify-between items-center">
            <Link href="/HomeLog" passHref>
                <h1 className="text-lg font-bold cursor-pointer">FoodBook</h1>
            </Link>
            <Link href="/search" passHref>
                <div className="flex items-center space-x-2 cursor-pointer">
                    <p className="text-black">Buscador</p>
                    <FontAwesomeIcon icon={faSearch} className="text-black" /> {/* Ícono de buscador */}
                </div>
            </Link>
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-800 p-2 rounded flex items-center">
                <FontAwesomeIcon icon={faSignOutAlt} className="text-white mr-2" /> {/* Ícono de cerrar sesión */}
                {/* Puedes eliminar el <p> aquí si no deseas texto */}
                <p className="text-white hidden">Cerrar Sesión</p> 
            </button>
        </header>
    );
};

export default Header;
