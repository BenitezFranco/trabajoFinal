import Link from 'next/link';
import Image from 'next/image'; // Importa el componente Image de Next.js
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons'; // Importa el ícono de buscador

const Header = () => {
    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login'; // Redirigir al login
    };

    return (
        <header className="bg-blue-400 text-white p-4 flex justify-between items-center">
            <Link href="/HomeLog" passHref>
                <div className="cursor-pointer">
                    {/* Incluye el logo en lugar del texto "FoodBook" */}
                    <Image 
                        src="/logo.png" // Asegúrate de que el logo esté en la carpeta public con este nombre
                        alt="FoodBook Logo"
                        width={100} // Ajusta el tamaño según tus necesidades
                        height={50}
                    />
                </div>
            </Link>
            <Link href="/search" passHref>
                <div className="flex items-center space-x-2 cursor-pointer">
                    <p className="text-black">Buscador</p>
                    <FontAwesomeIcon icon={faSearch} className="text-black" /> {/* Ícono de buscador */}
                </div>
            </Link>
            <button onClick={handleLogout} className="bg-red-800 hover:bg-red-600 p-2 rounded">
                <p className="text-white">Cerrar Sesión</p>   
            </button>
        </header>
    );
};

export default Header;
