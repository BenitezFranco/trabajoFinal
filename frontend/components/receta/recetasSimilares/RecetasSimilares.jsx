// components/RecetasSimilares.js
import { useEffect, useState } from 'react';
import CardReceta from '@/components/cards/receta/CardReceta';

const RecetasSimilares = ({ id, token }) => {
    const [recetas, setRecetas] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecetasSimilares = async () => {
            try {
                const response = await fetch(`http://localhost:3000/recetasSimilares/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Error al obtener las recetas similares');
                }
                const data = await response.json();
                setRecetas(data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchRecetasSimilares();
    }, [id, token]);

    if (error) {
        return <p className="text-red-500">Error: {error}</p>;
    }

    if (recetas.length === 0) {
        return <p className="text-gray-500">Cargando recetas similares...</p>;
    }

    return (
        <div className="grid grid-cols-1 gap-4 mt-6">
            <h2 className="text-xl text-center font-semibold mb-4 text-gray-800">Recetas similares</h2>
            {recetas.map((receta) => (
                <div key={receta.id} className="p-4 border border-gray-300 rounded-lg bg-gray-50 shadow-md">
                    <CardReceta item={receta}/>
                </div>
            ))}
        </div>
    );
};

export default RecetasSimilares;
