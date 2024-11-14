import { useState, useEffect } from 'react';
import CardReceta from '../cards/receta/CardReceta';
import CardUsuario from '../cards/usuario/CardUsuario';

const SearchGrid = ({ results }) => {
    const [followedUsers, setFollowedUsers] = useState(new Set());
    const [currentUserId, setCurrentUserId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false); 
    const [loadedImages, setLoadedImages] = useState({}); 

    const itemsPerPage = 3;

    useEffect(() => {
        const fetchFollowedUsers = async (id) => {
            try {
                const response = await fetch(`http://localhost:3000/seguimientos/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (response.status === 200) {
                    const data = await response.json();
                    const followedSet = new Set(data.map((user) => user.id_usuario_seguido));
                    setFollowedUsers(followedSet);    
                } else if (response.status === 401 || response.status === 403) {
                    alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
                    localStorage.removeItem('token');
                    router.push('/login');
                }
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

        const userId = getUserIdFromToken();
        fetchFollowedUsers(userId);
        
        setCurrentUserId(userId);
    }, []);

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

            if (response.status === 200) {
                setFollowedUsers((prev) => new Set([...prev, id_usuario]));
            } else if (response.status === 401 || response.status === 403) {
                alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
                localStorage.removeItem('token');
                router.push('/login');
            }
        } catch (error) {
            console.error('Error al seguir usuario:', error);
        }
    };

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
            if (response.status === 200) {
                setFollowedUsers((prev) => {
                    const newSet = new Set(prev);
                    newSet.delete(id_usuario);
                    return newSet;
                });
            } else if (response.status === 401 || response.status === 403) {
                alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
                localStorage.removeItem('token');
                router.push('/login');
            }
        } catch (error) {
            console.error('Error al dejar de seguir usuario:', error);
        }
    };

    useEffect(() => {
        setCurrentPage(1);
        setShowResults(false);
        setTimeout(() => setShowResults(true), 100); 
    }, [results]);

    const handleImageLoad = (id) => {
        setLoadedImages((prev) => ({ ...prev, [id]: true }));
    };

    const handlePageChange = (pageNumber) => {
        setLoading(true);
        setCurrentPage(pageNumber);
        setTimeout(() => {
            setLoading(false);
            setShowResults(true); 
        }, 300);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = results.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(results.length / itemsPerPage);

    return (
        <div className="max-w-6xl mx-auto mt-8 px-4 pb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 justify-items-center pt-6">
                {loading ? (
                    <div className="col-span-3 text-center">Cargando...</div>
                ) : currentItems.length === 0 ? (
                    <div className="col-span-3 text-center">No hay resultados para mostrar.</div>
                ) : (
                    currentItems.map((item) => (
                        <div
                            key={item.id_receta || item.id_usuario}
                            className={`w-full transition-opacity duration-500 ${showResults ? 'opacity-100' : 'opacity-0'} max-w-xs`}
                        >
                            {item.nombre ? (
                                <CardUsuario
                                    item={item}
                                    currentUserId={currentUserId}
                                    followedUsers={followedUsers}
                                    handleFollow={handleFollow}
                                    handleUnfollow={handleUnfollow}
                                    onLoadImage={() => handleImageLoad(item.id_usuario)}
                                    loaded={loadedImages[item.id_usuario]} 
                                />
                            ) : (
                                <CardReceta
                                    item={item}
                                    onLoadImage={() => handleImageLoad(item.id_receta)}
                                    loaded={loadedImages[item.id_receta]} 
                                />
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
                    style={{ visibility: currentPage === 1 ? 'hidden' : 'visible' }}
                >
                    Anterior
                </button>
                <span className="px-4 py-2 text-gray-700">
                    Página {currentPage} de {totalPages}
                </span>
                <button
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    style={{ visibility: currentPage === totalPages ? 'hidden' : 'visible' }}
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
};

export default SearchGrid;
