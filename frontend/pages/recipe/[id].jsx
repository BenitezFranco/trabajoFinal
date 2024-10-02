import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Rating from '@/components/rating/Rating'; // Importar el componente de calificación
import Header from '@/components/header.jsx/Header';
import Footer from '@/components/footer.jsx/Footer';

const RecipePage = () => {
    const router = useRouter();
    const { id } = router.query; // Obtener el id de la receta desde la URL
    const [receta, setReceta] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            // Fetch de la receta por ID
            const fetchReceta = async () => {
                const token = localStorage.getItem('token'); // Obtener el token del localStorage

                if (!token) {
                    // Si no hay token, redirigir o mostrar un mensaje
                    alert('Debes iniciar sesión para ver esta receta');
                    router.push('/login'); // Redirige a la página de login si no hay token
                    return;
                }

                try {
                    const response = await fetch(`http://localhost:3000/receta/${id}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}` // Enviar el token en el encabezado
                        }
                    });

                    if (response.status === 403 || response.status === 401) {
                        // Si la respuesta es un error de autenticación
                        alert('No tienes acceso para ver esta receta');
                        router.push('/login');
                    } else {
                        const data = await response.json();
                        console.log('Datos recibidos del backend:', data); // Para ver que envía
                        setReceta(data);
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

    if (loading) {
        return <p className="text-center text-lg">Cargando receta...</p>;
    }

    if (!receta) {
        return <p className="text-center text-lg text-red-500">Receta no encontrada</p>;
    }

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
                    <p className="text-lg font-medium mb-2"><strong>Fecha de Publicación:</strong> {new Date(receta.fecha_publicacion).toLocaleDateString()}</p>
                    <p className="text-lg font-medium mb-4"><strong>Autor:</strong> {receta.nombre_usuario}</p>

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
