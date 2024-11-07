import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Rating from '@/components/rating/Rating';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import Comentarios from '@/components/comentario/Comentarios';
import RecetasSimilares from '@/components/receta/recetasSimilares/RecetasSimilares';

const RecipePage = () => {
    const router = useRouter();
    const { id } = router.query;
    const [receta, setReceta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [esFavorito, setEsFavorito] = useState(false); // Estado para saber si es favorito

    const [favoritoCambiadoLocalmente, setFavoritoCambiadoLocalmente] = useState(false);

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
                    const response = await fetch(`http://localhost:3000/receta/${id}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });
    
                    if (response.status === 401 || response.status === 403) {
                        alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
                        localStorage.removeItem('token');
                        router.push('/login');
                        return;
                    }
    
                    const data = await response.json();
                    setReceta(data);
    
                    // Solo actualiza si no hay cambio local.
                    if (!favoritoCambiadoLocalmente) {
                        const favoritoResponse = await fetch(`http://localhost:3000/receta/${id}/favorito/estado`, {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });
    
                        if (favoritoResponse.status === 200) {
                            const favoritoData = await favoritoResponse.json();
                            setEsFavorito(favoritoData.estaEnFavoritos);
                        }
                    }
                } catch (error) {
                    console.error('Error al obtener la receta:', error);
                } finally {
                    setLoading(false);
                    setFavoritoCambiadoLocalmente(false); // Resetear cambio local después de sincronizar
                }
            };
    
            fetchReceta();
        }
    }, [id, favoritoCambiadoLocalmente]); // Se añade la dependencia para revalidar tras cambio
    
    

    const handleFavorito = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Debes iniciar sesión para agregar a favoritos');
            router.push('/login');
            return;
        }
    
        // Actualización optimista
        setEsFavorito(!esFavorito);
        setFavoritoCambiadoLocalmente(true);
    
        try {
            const url = `http://localhost:3000/receta/${id}/favorito`;
            const method = esFavorito ? 'DELETE' : 'POST';
    
            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
    
            console.log('Estado de respuesta del servidor:', response.status);
    
            if (![200, 201].includes(response.status)) {
                throw new Error(`Error: ${response.statusText} (Código: ${response.status})`);
            }
        } catch (error) {
            console.error('Error al actualizar favorito:', error.message);
            // Revertir si falla
            setEsFavorito(esFavorito);
            setFavoritoCambiadoLocalmente(false);
            alert(`Hubo un problema al actualizar los favoritos: ${error.message}`);
        }
    };
    
    
    

    
    if (loading) return <p className="text-center text-lg">Cargando receta...</p>;
    if (!receta) return <p className="text-center text-lg text-red-500">Receta no encontrada</p>;

    let instrucciones = [];
    try {
        instrucciones = JSON.parse(receta.instrucciones);
    } catch (error) {
        console.error('Error al parsear instrucciones:', error);
    }

    const ingredientes = (receta.ingredientes);

    const categorias = receta.categorias;

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
                <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6">
                    <h1 className="text-3xl font-bold text-center mb-4">{receta.titulo}</h1>
                    {receta.foto_receta && (
                        <img
                            src={receta.foto_receta}
                            alt={`Imagen de ${receta.titulo}`}
                            className="w-full h-auto rounded-lg mb-4"
                        />
                    )}
                    <p className="text-lg font-medium mb-2"><strong>Descripción:</strong> {receta.descripcion}</p>
                    <p className="text-lg font-medium mb-2"><strong>Ingredientes:</strong></p>
                    <ul className="list-disc list-inside mb-4">
                        {ingredientes.map((ingrediente, index) => (
                            <li key={index} className="mb-2">{ingrediente.nombre} : {ingrediente.cantidad}</li>
                        ))}
                    </ul>

                    <p className="text-lg font-medium mb-2"><strong>Instrucciones:</strong></p>
                    <ol className="list-disc list-inside mb-4">
                        {Array.isArray(instrucciones) && instrucciones.length > 0 ? (
                            instrucciones.map((instruccion, index) => (
                                <li key={index} className="mb-2">
                                    {instruccion.paso}
                                    {instruccion.imagen && (
                                        <img src={instruccion.imagen} alt={`Paso ${index + 1}`} className="mt-2" />
                                    )}
                                </li>
                            ))
                        ) : (
                            <li className="mb-2">No hay instrucciones disponibles.</li>
                        )}
                    </ol>
                    <p className="text-lg font-medium mb-2"><strong>Dificultad:</strong> {receta.dificultad}</p>
                    <p className="text-lg font-medium mb-2"><strong>Tiempo de Preparación:</strong> {receta.tiempo_preparacion} minutos</p>
                    {
                        categorias.map((categoria, index) =>
                            <label key={index} className="mr-4 mb-2">
                                <span className={`inline-block cursor-pointer px-4 py-2 rounded-md border  hover:bg-blue-400 transition`}>
                                    {categoria}
                                </span>
                            </label>
                        )

                    }
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

                    {/* Sección de comentarios */}
                    <Comentarios recetaId={id} autorRecetaId={receta.id_usuario} />

                    <RecetasSimilares id={id} token={localStorage.getItem('token')}/>
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
