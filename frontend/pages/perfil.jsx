import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const Perfil = () => {
    const [perfil, setPerfil] = useState(null);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchPerfil = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login'); // Redirigir al login si no hay token
                return;
            }

            try {
                const response = await fetch('http://localhost:3000/perfil', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` // Pasar el token en los headers
                    },
                });

                const result = await response.json();

                if (response.ok) {
                    setPerfil(result);
                } else {
                    setError(result.error || 'Error al obtener el perfil');
                }
            } catch (error) {
                setError('Error al obtener el perfil');
                console.error(error);
            }
        };

        fetchPerfil();
    }, [router]);

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    if (!perfil) {
        return <p>Cargando perfil...</p>;
    }

    return (
        <div>
            <h1>Perfil del Usuario</h1>
            <p>Nombre: {perfil.nombre}</p>
            <p>Correo Electrónico: {perfil.correo_electronico}</p>
            {perfil.foto_perfil && <img src={perfil.foto_perfil} alt="Foto de perfil" />}
        </div>
    );
};

export default Perfil;