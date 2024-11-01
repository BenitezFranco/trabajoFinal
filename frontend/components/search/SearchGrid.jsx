import { useState, useEffect } from 'react';
import CardReceta from '../cards/receta/CardReceta';
import CardUsuario from '../cards/usuario/CardUsuario';

const SearchGrid = ({ results }) => {
    const [followedUsers, setFollowedUsers] = useState(new Set());
    const [currentUserId, setCurrentUserId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false); // Estado para manejar la carga
    const itemsPerPage = 4;

    useEffect(() => {
        const fetchFollowedUsers = async () => {
            try {
                const response = await fetch('http://localhost:3000/seguimientos', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                const data = await response.json();
                const followedSet = new Set(data.map((user) => user.id_usuario_seguido));
                setFollowedUsers(followedSet);
            } catch (error) {
                console.error('Error al obtener seguimientos:', error);
            }
        };

        const getUserIdFromToken = () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    return payload.id_usuario;
                } catch (error) {
                    console.error('Error al extraer el ID del token:', error);
                    return null;
                }
            }
            return null;
        };

        fetchFollowedUsers();
        const userId = getUserIdFromToken();
        setCurrentUserId(userId);
    }, []);

    // Manejar el seguimiento de un usuario
    const handleFollow = async (id_usuario) => {
        try {
            const response = await fetch(`http://localhost:3000/follow`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ id_usuario_seguido: id_usuario }),
            });

            if (response.status === 401 || response.status === 403 || data.error) {
                localStorage.removeItem('token'); 
                router.push('/login'); 
            }

            if (response.ok) {
                setFollowedUsers((prev) => new Set([...prev, id_usuario])); // Añadir el usuario a la lista de seguidos
            } else {
                    console.error(data.error || 'Error inesperado');

            }
        } catch (error) {
            console.error('Error al seguir usuario:', error);
        }
    };

    // Manejar el dejar de seguir a un usuario
    const handleUnfollow = async (id_usuario) => {
        try {
            const response = await fetch(`http://localhost:3000/unfollow`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ id_usuario_seguido: id_usuario }),
            });
            
            if (response.ok) {
                setFollowedUsers((prev) => {
                    const newSet = new Set(prev);
                    newSet.delete(id_usuario);
                    return newSet;
                });
            } else {
                console.error('Error al dejar de seguir usuario:', await response.text());
            }
        } catch (error) {
            console.error('Error al dejar de seguir usuario:', error);
        }
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [results]);

    const handlePageChange = (pageNumber) => {
        setLoading(true); // Activar "cargando"
        setCurrentPage(pageNumber);

        // Simular un pequeño retraso para mostrar el estado "cargando" (si es necesario)
        setTimeout(() => {
            setLoading(false);
        }, 300); // Esto es opcional y depende de si necesitas un pequeño retraso para la transición
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = results.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(results.length / itemsPerPage);

    return (
        <div className='max-w-6xl mx-auto mt-24 px-4 pb-8'> {/* Estilos con Tailwind */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center pt-11">
                {loading ? (
                    <div className="col-span-4 text-center">Cargando...</div>
                ) : currentItems.length === 0 ? (
                    <div className="col-span-4 text-center">No hay resultados para mostrar.</div>
                ) : (
                    currentItems.map((item) => (
                        <div key={item.id_usuario || item.id} className="w-full">
                            {item.nombre ? (
                                <CardUsuario
                                    item={item}
                                    currentUserId={currentUserId}
                                    followedUsers={followedUsers}
                                    handleFollow={handleFollow}
                                    handleUnfollow={handleUnfollow}
                                />
                            ) : (
                                <div className="w-full h-full max-w-xs">
                                    <CardReceta item={item} />
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
            <div className="flex justify-center mt-6 space-x-2">
                <button
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={{ visibility: currentPage === 1 ? 'hidden' : 'visible' }}>
                    Anterior
                </button>
                <span className="px-4 py-2 text-gray-700">
                    Página {currentPage} de {totalPages}
                </span>
                <button
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    style={{ visibility: currentPage === totalPages ? 'hidden' : 'visible' }}>
                    Siguiente
                </button>
            </div>
        </div>
    );

};

export default SearchGrid;
