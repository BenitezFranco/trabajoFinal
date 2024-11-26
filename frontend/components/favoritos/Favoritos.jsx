import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const Favoritos = () => {
    const router = useRouter();
    const [favoritos, setFavoritos] = useState([]);
    const [loading, setLoading] = useState(true);
    const { id } = router.query; // Obtención del id de la URL

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        const fetchFavoritos = async () => {
            setFavoritos([]);  // Limpiar favoritos anteriores
            try {
                const response = await fetch(`http://localhost:3000/favoritos/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.status === 200) {
                    const data = await response.json();
                    setFavoritos(data);
                } else if (response.status === 401 || response.status === 403) {
                    alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
                    localStorage.removeItem('token');
                    router.push('/login');
                }
            } catch (error) {
                console.error('Error al obtener favoritos:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {  // Solo realizar la llamada si `id` está disponible
            fetchFavoritos();
        }
    }, [id, router]); // Agrega `id` como dependencia para que se ejecute cuando cambie

    if (loading) return <p className="text-center text-lg">Cargando favoritos...</p>;

    return (
        <div className="mt-6">
            <p className="text-2xl font-bold mb-6">Recetas Favoritas</p>
            {favoritos.length === 0 ? (
                <p className="text-center text-lg">No tiene recetas favoritas.</p>
            ) : (
                <div className="space-y-6 max-h-[33rem] overflow-y-scroll">
                    {favoritos.map((favorito) => (
                        <div 
                            key={favorito.id_receta} 
                            onClick={() => router.push(`/recipe/${favorito.id_receta}`)}
                            className="flex items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105 cursor-pointer"
                        >
                            {/* Imagen de la receta, redondeada y pequeña */}
                            <img 
                                src={favorito.Recetum.foto_receta} 
                                alt={favorito.Recetum.titulo} 
                                className="w-16 h-16 object-cover rounded-full mr-4"
                            />
                            
                            {/* Contenedor del título */}
                            <div className="flex-grow">
                                <p className="text-lg font-semibold text-gray-800 mb-2">
                                    {favorito.Recetum.titulo}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Favoritos;
