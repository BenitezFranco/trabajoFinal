import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const Seguidor = () => {
    const router = useRouter();
    const [seguidores, setSeguidores] = useState([]);
    const [loading, setLoading] = useState(true);
    const { id } = router.query;
    
    // Limpiar los seguidores cuando cambie el id del perfil
    useEffect(() => {
        setSeguidores([]); // Limpiar seguidores al cambiar el perfil
        setLoading(true);  // Volver a poner en loading cuando cambia el perfil
    }, [id]);

    useEffect(() => {
        if (!id) return; // Si no hay id en la URL, no hacer la solicitud

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
    }, [id, router]);

    if (loading) return <p className="text-center text-lg">Cargando seguidores...</p>;

    return (
        <div className="mt-6">
            <h3 className="text-2xl font-bold mb-6">Seguidores</h3>
            {seguidores.length === 0 ? (
                <p className="text-center text-lg">Sin seguidores</p>
            ) : (
                <div className="max-h-[33rem] overflow-y-scroll space-y-4">
                    <ul className="grid gap-6">
                        {seguidores.map((seguidor) => (
                            <li
                                key={seguidor.seguidor.id_usuario}
                                onClick={() => router.push(`/perfil/${seguidor.seguidor.id_usuario}`)}
                                className="p-4 flex items-center bg-white rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105 cursor-pointer"
                            >
                                <div className="flex-shrink-0">
                                    {/* Imagen del seguidor o imagen predeterminada si avatar es null */}
                                    <img
                                        src={seguidor.seguidor.foto_perfil || 'http://localhost:3000/uploads/default-image.png'}
                                        alt={`${seguidor.seguidor.nombre} avatar`}
                                        className="w-12 h-12 rounded-full border-2 border-blue-400"
                                    />
                                </div>
                                <div className="ml-4">
                                    <h4 className="text-lg font-semibold text-blue-500 hover:underline">{seguidor.seguidor.nombre}</h4>
                                    <p className="text-sm text-gray-600">Seguidor desde {seguidor.fecha_seguimiento}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Seguidor;
