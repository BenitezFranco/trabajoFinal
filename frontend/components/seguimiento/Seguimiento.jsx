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
                const textResponse = await response.text(); // Obtener la respuesta como texto
                console.log('Response:', textResponse);
                if (response.ok) {
                    const data = JSON.parse(textResponse);
                    
                    setSeguimientos(data);
                } else {
                    console.error('Error al obtener seguimientos');
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
            <h3 className="text-lg font-medium mb-2">Usuarios que sigues:</h3>
            <ul>
                {seguimientos.map((seguimiento) => (
                    <li key={seguimiento.id_seguimiento} className="flex items-center mb-4">
                        {console.log("informacion seguimiento", seguimiento)}
                        <span 
                            onClick={() => router.push(`/perfil/${seguimiento.id_usuario_seguido}`)} 
                            className="cursor-pointer text-blue-500 hover:underline"
                        >
                            {seguimiento.seguido.nombre}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Seguimientos;
