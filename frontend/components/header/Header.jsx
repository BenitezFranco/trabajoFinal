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
                    <div className="flex items-center space-x-2 cursor-pointer">
                        <FontAwesomeIcon icon={faSearch} className="text-white" />
                        <span className="text-white">Buscar</span> {/* Texto blanco junto al icono */}
                    </div>
                </Link>

                {isAuthenticated && (
                    <>
                        <button
                            onClick={handlePerfilClick}
                            className="p-2 rounded-full flex items-center"
                        >
                            <FontAwesomeIcon icon={faUser} className="text-white" /> {/* Ícono blanco sin fondo */}
                            <span className="text-white ml-2">Perfil</span>
                        </button>

                        <button
                            onClick={handleCrearRecetaClick}
                            className="p-2 rounded-full flex items-center"
                        >
                            <FontAwesomeIcon icon={faPlus} className="text-white" /> {/* Ícono blanco sin fondo */}
                            <span className="text-white ml-2">Crear receta</span>
                        </button>

                        <button
                            onClick={handleLogout}
                            className="p-2 rounded-full flex items-center"
                        >
                            <FontAwesomeIcon icon={faSignOutAlt} className="text-white" /> {/* Ícono blanco sin fondo */}
                            <span className="text-white ml-2">Cerrar sesión</span>
                        </button>
                    </>
                )}

            </div>
        </header>
    );
};

export default Header;
