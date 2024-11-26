import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import FollowButton from '@/components/followButton/FollowButton';
import SearchGrid from '@/components/search/SearchGrid';
import Favoritos from '@/components/favoritos/Favoritos';
import Seguidores from '@/components/seguidores/Seguidores';
import Seguimientos from '@/components/seguimiento/Seguimiento';
import CustomHead from "@/components/head/CustomHead";

const PerfilUsuario = () => {
    const [perfil, setPerfil] = useState(null);
    const [recetas, setRecetas] = useState([]); // Estado para las recetas
    const [error, setError] = useState('');
    const [followedUsers, setFollowedUsers] = useState(new Set());
    const [currentUserId, setCurrentUserId] = useState(null);
    const router = useRouter();
    const { id } = router.query; // Obtener el ID del usuario de la URL

    useEffect(() => {
        const fetchPerfil = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.log('No token, redirecting to /login');
                router.push('/login');
                return;
            }

            console.log('Token found:', token);

            try {
                const response = await fetch(`http://localhost:3000/perfil/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        'Cache-Control': 'no-cache',
                        'Pragma': 'no-cache',
                    },
                });
                if (response.status === 200) {
                    const result = await response.json();
                    setPerfil(result);
                    fetchRecetas(result.nombre); // Buscar las recetas usando el nombre del perfil
                } else if (response.status === 401 || response.status === 403) {
                    alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
                    localStorage.removeItem('token');
                    router.push('/login');
                }
            } catch (error) {
                console.error('Error fetching profile', error);
                setError('Error al obtener el perfil');
            }
        };

        const fetchRecetas = async (creadorNombre) => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.log('No token, redirecting to /login');
                router.push('/login');
                return;
            }

            console.log('Token found:', token);

            try {
                const response = await fetch(`http://localhost:3000/search?creador=${creadorNombre}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        'Cache-Control': 'no-cache',
                        'Pragma': 'no-cache',
                    },
                });
                if (response.status === 200) {
                    const result = await response.json();
                    setRecetas(result); // Guardar las recetas obtenidas
                } else if (response.status === 401 || response.status === 403) {
                    alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
                    localStorage.removeItem('token');
                    router.push('/login');
                }
            } catch (error) {
                console.error('Error fetching recipes', error);
                setError('Error al obtener las recetas');
            }
        };

        const fetchFollowedUsers = async (usuario) => {
            try {

                const response = await fetch(`http://localhost:3000/seguimientos/${usuario}`, {
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
                    const payload = JSON.parse(atob(token.split('.')[1])); // Extraer el payload del JWT
                    return payload.id_usuario; // Aquí asumo que el token tiene un campo 'id_usuario'
                } catch (error) {
                    console.error('Error al extraer el ID del token:', error);
                    return null;
                }
            }
            return null;
        };

        if (id) { // Asegúrate de que el ID esté disponible antes de hacer la solicitud
            fetchPerfil();
            const userId = getUserIdFromToken(); // Obtener el ID del usuario autenticado desde el token
            setCurrentUserId(userId);
            fetchFollowedUsers(userId); // Cargar los usuarios seguidos
        }
    }, [router, id]);

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    if (!perfil) {
        return <p>Cargando perfil...</p>;
    }
    console.log(followedUsers.has(perfil.id_usuario));
    return (
        <div className="flex flex-col min-h-screen">
            <CustomHead title={`Perfil de ${perfil.nombre}`} description={`Pagina de perfil del usuario ${perfil.nombre}`}/>
            <Header/>
            <main role="main" className="flex-grow p-6 bg-gray-100">
                <div className="grid grid-cols-5 grid-rows-2 gap-4">
                    <div className="">
                        <Seguimientos />
                        <Seguidores />
                    </div>
                    <div className="col-span-3">
                        <div className="bg-gray-100">
                            <div className="container mx-auto py-8">
                                <div className="grid grid-cols-1 grid-rows-2 gap-6 px-4">
                                    {/* Primer div: Imagen a la izquierda y texto a la derecha */}
                                    <div className="bg-white shadow rounded-lg p-6">
                                        <div className="flex items-center space-x-6">
                                            {/* Imagen */}
                                            {perfil.foto_perfil && (
                                                <img
                                                    src={perfil.foto_perfil}
                                                    alt="Foto de perfil"
                                                    className="w-32 h-32 bg-gray-300 rounded-full"
                                                />
                                            )}

                                            {/* Información del perfil */}
                                            <div className="flex flex-col justify-start space-y-4">
                                                <h1 className="text-xl font-bold">{perfil.nombre}</h1>
                                                <p className="text-gray-700">{perfil.descripcion_breve}</p>

                                                {/* Correo visible */}
                                                {perfil.es_visible && <p className="text-gray-700">{perfil.correo_electronico}</p>}

                                                {/* Botón Follow/Unfollow */}
                                                {perfil.id_usuario !== currentUserId && (
                                                    <FollowButton
                                                        id_usuario={perfil.id_usuario}
                                                        isFollowed={followedUsers.has(perfil.id_usuario)}
                                                        onFollow={async (id_usuario) => {
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
                                                        }}
                                                        onUnfollow={async (id_usuario) => {
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
                                                        }}
                                                    />
                                                )}
                                                {perfil.id_usuario === currentUserId && (
                                                    <a href='/editar-perfil'>
                                                        <button
                                                            className={`py-1 px-3 rounded bg-green-700 hover:bg-green-600 text-white font-bold`}>Editar</button>
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Segundo div: Sección Sobre mí */}
                                    <div className="bg-white shadow rounded-lg p-6 break-words">
                                        <h2 className="text-xl font-bold mb-4">Sobre mi</h2>
                                        <p className="text-gray-700">{perfil.presentacion}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-start-5">
                        <Favoritos />
                    </div>
                    {/* Mostrar recetas del creador */}
                    <div className="col-span-5 row-start-2">
                        <h2 className="text-xl text-center font-bold mt-6 mb-4">Recetas del Usuario</h2>
                        {recetas.length === 0 ? (
                            <p>No hay recetas disponibles.</p>
                        ) : (
                            <SearchGrid results={recetas}></SearchGrid>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PerfilUsuario;
