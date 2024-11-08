import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const Seguidor = () => {
    const router = useRouter();
    const [seguidores, setSeguidores] = useState([]);
    const [loading, setLoading] = useState(true);
    const { id } = router.query;

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        const fetchSeguidores = async () => {
            try {
                const response = await fetch(`http://localhost:3000/seguidores/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                });
                console.log("Desde seguidores ",response);

                if (response.status === 200) {
                    const data = await response.json();
                    setSeguidores(data);
                    } else if (response.status === 401 || response.status === 403) {
                    alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
                    localStorage.removeItem('token');
                    router.push('/login');
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

    return (
        <div className="mt-4">
            <h3 className="text-2xl font-bold mb-4">Sus Seguidores:</h3>
            {seguidores.length === 0 ? (<p className="text-center text-lg">No tiene seguidores.</p>
        ):(
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
        )}
        </div>
    );
    
};

export default Seguidor;
