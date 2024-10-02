import { useEffect, useState } from 'react';

const Seguimientos = () => {
    const [seguimientos, setSeguimientos] = useState([]);
    const [loading, setLoading] = useState(true);

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

                if (response.ok) {
                    const data = await response.json();
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
                       {/*<img 
                            src={seguimiento.seguido.foto_perfil || '/default-profile.png'} 
                            alt={seguimiento.seguido.nombre} 
                            className="w-10 h-10 rounded-full mr-4" 
                        />  */}
                        <span>{seguimiento.seguido.nombre}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Seguimientos;
