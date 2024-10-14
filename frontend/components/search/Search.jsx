import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../header/Header';
import Footer from '../footer/Footer';

const Search = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('titulo');
    const [results, setResults] = useState([]);
    const [searchSubmitted, setSearchSubmitted] = useState(false);
    const [followedUsers, setFollowedUsers] = useState(new Set()); // Para rastrear usuarios seguidos
    const [currentUserId, setCurrentUserId] = useState(null); // Almacena el ID del usuario autenticado

    // Cargar usuarios seguidos y obtener el ID del usuario autenticado desde localStorage
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
                setFollowedUsers(followedSet); // Cargar los usuarios seguidos en el estado
            } catch (error) {
                console.error('Error al obtener seguimientos:', error);
            }
        };

        const getUserIdFromToken = () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const payload = JSON.parse(atob(token.split('.')[1])); // Extraer el payload del JWT
                    return payload.id_usuario; // Aquí asumo que el token tiene un campo 'id_usuario'
                } catch (error) {
                    console.error('Error al extraer el ID del token:', error);
                    return null;
                }
            }
            return null;
        };

        fetchFollowedUsers();
        const userId = getUserIdFromToken(); // Obtener el ID del usuario autenticado desde el token
        setCurrentUserId(userId);
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        setSearchSubmitted(true);

        try {
            const response = await fetch(`http://localhost:3000/search?filter=${filter}&term=${searchTerm}`);
            const data = await response.json();
            setResults(data);
        } catch (error) {
            console.error('Error al realizar la búsqueda:', error);
        }
    };

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

            if (response.ok) {
                setFollowedUsers((prev) => new Set([...prev, id_usuario])); // Añadir el usuario a la lista de seguidos
            } else {
                console.error('Error al seguir usuario:', await response.text());
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
                }); // Eliminar el usuario de la lista de seguidos
            } else {
                console.error('Error al dejar de seguir usuario:', await response.text());
            }
        } catch (error) {
            console.error('Error al dejar de seguir usuario:', error);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-00">
                <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold text-center mb-6">Buscar Recetas o Usuarios</h1>
                    <form onSubmit={handleSearch} className="mb-4">
                        <div className="flex flex-col space-y-4">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Escribe aquí para buscar"
                                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="titulo">Por Título</option>
                                <option value="ingredientes">Por Ingredientes</option>
                                <option value="dificultad">Por Dificultad</option>
                                <option value="creador">Por Creador (nombre de usuario)</option>
                                <option value="usuario">Buscar Usuario</option>
                            </select>

                            <button
                                type="submit"
                                className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Buscar
                            </button>
                        </div>
                    </form>

                    {/* Mostrar los resultados */}
                    {searchSubmitted && results.length > 0 ? (
                        <ul className="space-y-4">
                            {results.map((item) => (
                                <li
                                    key={item.id_usuario || item.id_receta}
                                    className="border border-gray-300 rounded-lg p-4 bg-gray-50 shadow-md hover:bg-gray-100"
                                >
                                    {item.nombre ? (
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-medium">
                                                {item.nombre}
                                            </span>
                                            {/* Botón de seguir/dejar de seguir */}
                                            {item.id_usuario !== currentUserId && (
                                                <button
                                                    onClick={() =>
                                                        followedUsers.has(item.id_usuario)
                                                            ? handleUnfollow(item.id_usuario)
                                                            : handleFollow(item.id_usuario)
                                                    }
                                                    className={`py-1 px-3 rounded ${followedUsers.has(item.id_usuario)
                                                        ? 'bg-red-500 hover:bg-red-600'
                                                        : 'bg-green-500 hover:bg-green-600'
                                                    } text-white font-bold`}
                                                >
                                                    {followedUsers.has(item.id_usuario) ? 'Dejar de seguir' : 'Seguir'}
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        <Link href={`/recipe/${item.id_receta}`} className="text-lg font-medium text-blue-600 hover:underline">
                                            Receta: {item.titulo}
                                            <p className="text-sm text-gray-600">Descripción: {item.descripcion}</p>
                                            <p className="text-sm text-gray-500">Dificultad: {item.dificultad}</p>
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : searchSubmitted && results.length === 0 ? (
                        <p className="text-gray-500 text-center">No se encontraron resultados</p>
                    ) : null}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Search;
