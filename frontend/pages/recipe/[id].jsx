import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

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
                        console.log('Datos recibidos del backend:', data);//Para ver que envia
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
        return <p>Cargando receta...</p>;
    }

    if (!receta) {
        return <p>Receta no encontrada</p>;
    }

    return (
        <div>
            <h1>{receta.titulo}</h1>
            <p><strong>Descripción:</strong> {receta.descripcion}</p>
            <p><strong>Instrucciones:</strong> {receta.instrucciones}</p>
            <p><strong>Ingredientes:</strong> {receta.ingredientes}</p>
            <p><strong>Dificultad:</strong> {receta.dificultad}</p>
            <p><strong>Tiempo de Preparación:</strong> {receta.tiempo_preparacion} minutos</p>
            <p><strong>Fecha de Publicación:</strong> {new Date(receta.fecha_publicacion).toLocaleDateString()}</p>
            <p><strong>Autor:</strong> {receta.nombre_usuario}</p>
        </div>
    );
};

export default RecipePage;
