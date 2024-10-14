import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import FollowButton from '@/components/followButton/FollowButton'; // Asegúrate de importar el botón de seguimiento

const PerfilUsuario = () => {
    const [perfil, setPerfil] = useState(null);
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
                        'Cache-Control': 'no-cache', // Evitar caché
                        'Pragma': 'no-cache', // Para compatibilidad con navegadores antiguos
                    },
                });
                

                const result = await response.json();

                if (response.ok) {
                    console.log('Profile fetched successfully:', result);
                    setPerfil(result);
                } else {
                    console.error('Error fetching profile:', result.error);
                    setError(result.error || 'Error al obtener el perfil');
                }
            } catch (error) {
                console.error('Error fetching profile', error);
                setError('Error al obtener el perfil');
            }
        };

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

        if (id) { // Asegúrate de que el ID esté disponible antes de hacer la solicitud
            fetchPerfil();
            const userId = getUserIdFromToken(); // Obtener el ID del usuario autenticado desde el token
            setCurrentUserId(userId);
            fetchFollowedUsers(); // Cargar los usuarios seguidos
        }
    }, [router, id]);

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    if (!perfil) {
        return <p>Cargando perfil...</p>;
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow p-6 bg-gray-100">
                <h1 className="text-2xl font-bold mb-4">Perfil del Usuario</h1>
                <p>Nombre: {perfil.nombre}</p>
                <p>Correo Electrónico: {perfil.correo_electronico}</p> {/* Corregido */}
                {perfil.foto_perfil && (
                    <img src={perfil.foto_perfil} alt="Foto de perfil" className="mt-4" />
                )}
                
                {perfil.id_usuario !== currentUserId && ( // No mostrar el botón si es el propio usuario
                    <FollowButton
                        id_usuario={perfil.id_usuario}
                        isFollowed={followedUsers.has(perfil.id_usuario)} // Verifica si se está siguiendo
                        onFollow={async (id_usuario) => {
                            // Lógica para seguir al usuario
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
                        }}
                        onUnfollow={async (id_usuario) => {
                            // Lógica para dejar de seguir al usuario
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
                        }}
                    />
                )}
            </main>
            <Footer />
        </div>
    );
};

export default PerfilUsuario;
