import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Rating from '@/components/rating/Rating';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';

const RecipePage = () => {
    const router = useRouter();
    const { id } = router.query;
    const [receta, setReceta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [esFavorito, setEsFavorito] = useState(false); // Estado para saber si es favorito

    useEffect(() => {
        if (id) {
            const fetchReceta = async () => {
                const token = localStorage.getItem('token');
                if (!token) {
                    alert('Debes iniciar sesión para ver esta receta');
                    router.push('/login');
                    return;
                }

                try {
                    // Obtener los detalles de la receta
                    const response = await fetch(`http://localhost:3000/receta/${id}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    const data = await response.json();
                    setReceta(data);

                    // Verificar si la receta está en favoritos
                    const favoritoResponse = await fetch(`http://localhost:3000/receta/${id}/favorito/estado`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (favoritoResponse.ok) {
                        const favoritoData = await favoritoResponse.json();
                        setEsFavorito(favoritoData.estaEnFavoritos);
                    }
                } catch (error) {
                    console.error('Error al obtener la receta:', error);
                } finally {
                    setLoading(false);
                }
            };

            fetchReceta();
        }
    }, [id]);

    const handleFavorito = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Debes iniciar sesión para agregar a favoritos');
            router.push('/login');
            return;
        }

        try {
            const url = `http://localhost:3000/receta/${id}/favorito`;
            const method = esFavorito ? 'DELETE' : 'POST'; // Determina si agregar o eliminar
            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                setEsFavorito(!esFavorito); // Cambiar el estado según la acción realizada
            } else {
                console.error('Error al actualizar favorito:', await response.json());
            }
        } catch (error) {
            console.error('Error al actualizar favorito:', error);
        }
    };

    if (loading) return <p className="text-center text-lg">Cargando receta...</p>;
    if (!receta) return <p className="text-center text-lg text-red-500">Receta no encontrada</p>;

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
                <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6">
                    <h1 className="text-3xl font-bold text-center mb-4">{receta.titulo}</h1>
                    <p className="text-lg font-medium mb-2"><strong>Descripción:</strong> {receta.descripcion}</p>
                    <p className="text-lg font-medium mb-2"><strong>Instrucciones:</strong> {receta.instrucciones}</p>
                    <p className="text-lg font-medium mb-2"><strong>Ingredientes:</strong> {receta.ingredientes}</p>
                    <p className="text-lg font-medium mb-2"><strong>Dificultad:</strong> {receta.dificultad}</p>
                    <p className="text-lg font-medium mb-2"><strong>Tiempo de Preparación:</strong> {receta.tiempo_preparacion} minutos</p>
                    <p className="text-lg font-medium mb-4"><strong>Autor:</strong> {receta.nombre_usuario}</p>

                    {/* Botón para agregar/quitar favoritos */}
                    <button
                        onClick={handleFavorito}
                        className={`mt-4 py-2 px-4 rounded-lg font-bold focus:outline-none focus:ring-2 ${esFavorito ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}
                    >
                        {esFavorito ? 'Eliminar de Favoritos' : 'Agregar a Favoritos'}
                    </button>

                    {/* Componente de Calificación */}
                    <Rating recetaId={id} />

                    <button
                        onClick={() => router.back()}
                        className="mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Volver
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default RecipePage;
