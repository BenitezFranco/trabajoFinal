import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const Seguidor = () => {
    const router = useRouter();
    const [seguidores, setSeguidores] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        const fetchSeguidores = async () => {
            try {
                const response = await fetch('http://localhost:3000/seguidores', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setSeguidores(data);
                } else {
                    console.error('Error al obtener seguidores:', await response.json());
                }
            } catch (error) {
                console.error('Error al obtener seguidores:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSeguidores();
    }, [router]);

    if (loading) return <p className="text-center text-lg">Cargando seguidores...</p>;
    if (seguidores.length === 0) return <p className="text-center text-lg">No tienes seguidores.</p>;

    return (
        <div className="mt-4">
            <h3 className="text-2xl font-bold mb-4">Tus Seguidores:</h3>
            <div className="max-h-[33rem] overflow-y-scroll">
                <ul className="space-y-4">
                    {seguidores.map((seguidor) => (
                        <li key={seguidor.seguidor.id_usuario} className="flex items-center p-4 bg-gray-200 rounded-lg shadow hover:bg-gray-100 transition duration-200 transform hover:scale-95">
                            <span
                                onClick={() => router.push(`/perfil/${seguidor.seguidor.id_usuario}`)}
                                className="cursor-pointer text-blue-500 hover:underline font-semibold"
                            >
                                {seguidor.seguidor.nombre}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
    
};

export default Seguidor;
