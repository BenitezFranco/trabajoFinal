import Link from 'next/link';  // Asegúrate de importar Link
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSignOutAlt, faUser, faPlus } from '@fortawesome/free-solid-svg-icons'; // Íconos importados

const Header = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado para verificar autenticación
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);  // Actualiza el estado
        window.location.href = '/login'; // Redirigir al login
    };

    const handlePerfilClick = () => {
        router.push('/perfil');
    };

    const handleCrearRecetaClick = () => {
        router.push('/create-recipe');
    };

    // Verifica si el usuario está autenticado
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    return (
        <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
    <Link href="/HomeLog" passHref>
        <h1 className="text-lg font-bold cursor-pointer">FoodBook</h1>
    </Link>

    {/* Menú del Header */}
    <div className="flex items-center space-x-4">
        <Link href="/search" passHref>
            <div className="flex items-center space-x-2 cursor-pointer group"> {/* group para aplicar hover */}
                <FontAwesomeIcon icon={faSearch} className="text-white group-hover:text-blue-300" />
                <span className="text-white group-hover:text-blue-300">Buscar</span> {/* Cambia el color del texto e icono */}
            </div>
        </Link>

        {/* Otros botones, si los tienes */}
        {isAuthenticated && (
            <>
                <button
                    onClick={handlePerfilClick}
                    className="p-2 rounded-full flex items-center group" // group para aplicar hover
                >
                    <FontAwesomeIcon icon={faUser} className="text-white group-hover:text-blue-300" />
                    <span className="text-white ml-2 group-hover:text-blue-300">Perfil</span>
                </button>

                <button
                    onClick={handleCrearRecetaClick}
                    className="p-2 rounded-full flex items-center group" // group para aplicar hover
                >
                    <FontAwesomeIcon icon={faPlus} className="text-white group-hover:text-green-300" />
                    <span className="text-white ml-2 group-hover:text-green-300">Crear receta</span>
                </button>
            </>
        )}

        <button
            onClick={handleLogout}
            className="p-2 rounded-full flex items-center group" // group para aplicar hover
        >
            <FontAwesomeIcon icon={faSignOutAlt} className="text-white group-hover:text-red-300" />
            <span className="text-white ml-2 group-hover:text-red-300">Cerrar sesión</span>
        </button>
    </div>
</header>

    );
};

export default Header;
