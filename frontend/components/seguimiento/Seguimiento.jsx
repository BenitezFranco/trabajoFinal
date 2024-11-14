import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const Seguimientos = () => {
    const [seguimientos, setSeguimientos] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        const fetchSeguimientos = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const response = await fetch(`http://localhost:3000/seguimientos/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.status === 200) {
                    const textResponse = await response.text();
                    const data = JSON.parse(textResponse);
                    setSeguimientos(data);
                } else if (response.status === 401 || response.status === 403) {
                    alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
                    localStorage.removeItem('token');
                    router.push('/login');
                }
            } catch (error) {
                console.error('Error al obtener seguimientos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSeguimientos();
    }, [id, router]);

    if (loading) {
        return <p className="text-center text-lg">Cargando seguimientos...</p>;
    }

    return (
        <div className="mt-6">
            <h3 className="text-2xl font-bold mb-6">Seguidos</h3>
            {seguimientos.length === 0 ? (
                <p className="text-center text-lg">Sin seguidos</p>
            ) : (
                <div className="max-h-[33rem] overflow-y-scroll space-y-4">
                    <ul className="grid gap-6">
                        {seguimientos.map((seguimiento) => (
                            <li
                                key={seguimiento.id_seguimiento}
                                onClick={() => router.push(`/perfil/${seguimiento.id_usuario_seguido}`)}
                                className="flex items-center p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105 cursor-pointer"
                            >
                                {/* Imagen de perfil o imagen predeterminada */ console.log (seguimiento.seguido)}
                                
                                <div className="flex-shrink-0">
                                    <img
                                        src={seguimiento.seguido.foto_perfil || 'http://localhost:3000/uploads/default-image.png'}
                                        
                                        alt={`${seguimiento.seguido.nombre} avatar`}
                                        className="w-12 h-12 rounded-full border-2 border-blue-400"
                                    />
                                </div>
                                <div className="ml-4">
                                    <h4 className="text-lg font-semibold text-blue-500 hover:underline">{seguimiento.seguido.nombre}</h4>
                                    <p className="text-sm text-gray-600">Sigues desde {seguimiento.fecha_seguimiento}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Seguimientos;
