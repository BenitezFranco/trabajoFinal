import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';

const PerfilUsuario = () => {
    const [perfil, setPerfil] = useState(null);
    const [error, setError] = useState('');
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
                        'Authorization': `Bearer ${token}`
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

        if (id) { // Asegúrate de que el ID esté disponible antes de hacer la solicitud
            fetchPerfil();
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
                <p>Correo Electrónico: {perfil.email}</p> {/* Corregido */}
                {perfil.foto_perfil && (
                    <img src={perfil.foto_perfil} alt="Foto de perfil" className="mt-4" />
                )}
            </main>
            <Footer />
        </div>
    );
};

export default PerfilUsuario;
