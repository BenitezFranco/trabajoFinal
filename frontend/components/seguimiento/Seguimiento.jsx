import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const Seguimientos = () => {
    const [seguimientos, setSeguimientos] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchSeguimientos = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const response = await fetch('http://localhost:3000/seguimientos', {
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
    }, []);

    if (loading) {
        return <p>Cargando seguimientos...</p>;
    }

    if (seguimientos.length === 0) {
        return <p>No sigues a ningún usuario aún.</p>;
    }

    return (
        <div className="mt-4">
            <h3 className="text-2xl font-bold mb-4">Usuarios que sigues:</h3>
            <div className="max-h-[33rem] overflow-y-scroll">
            <ul className="space-y-4">
                {seguimientos.map((seguimiento) => (
                    <li key={seguimiento.id_seguimiento} className="flex items-center p-4 bg-gray-200 rounded-lg shadow hover:bg-gray-100 transition duration-200 transition-transform transform hover:scale-95">
                        <span
                            onClick={() => router.push(`/perfil/${seguimiento.id_usuario_seguido}`)}
                            className="cursor-pointer text-blue-500 hover:underline font-semibold"
                        >
                            {seguimiento.seguido.nombre}
                        </span>
                    </li>
                ))}                
                </ul>
            </div>
        </div>
    );

};

export default Seguimientos;
