import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const Favoritos = () => {
    const router = useRouter();
    const [favoritos, setFavoritos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        const fetchFavoritos = async () => {
            try {
                const response = await fetch('http://localhost:3000/favoritos', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setFavoritos(data);
                } else {
                    console.error('Error al obtener favoritos:', await response.json());
                }
            } catch (error) {
                console.error('Error al obtener favoritos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFavoritos();
    }, [router]);

    if (loading) return <p className="text-center text-lg">Cargando favoritos...</p>;
    if (favoritos.length === 0) return <p className="text-center text-lg">No tienes recetas favoritas.</p>;

    return (
        <div className="mt-6">
            <h3 className="text-2xl font-bold mb-4">Tus Recetas Favoritas</h3>
            {/* Contenedor de favoritos con altura fija y scroll */}
            <div className="max-h-[33rem] overflow-y-scroll">
                <ul className="space-y-4">
                    {favoritos.map((favorito) => (
                        <li 
                            key={favorito.id_receta} 
                            className="flex-grow p-6 bg-gray-200 rounded-lg shadow-md hover:bg-gray-100 transition-transform transform hover:scale-95"
                        >
                            <h3 className="text-xl font-semibold mb-2">{favorito.Recetum.titulo}</h3>
                            <button 
                                onClick={() => router.push(`/recipe/${favorito.id_receta}`)}
                                className="bg-blue-500 text-white font-bold py-1 px-2 rounded hover:bg-blue-600 transition duration-200"
                            >
                                Ver Receta
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Favoritos;
