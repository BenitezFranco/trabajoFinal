import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as fullHeart, faHeart as emptyHeart } from '@fortawesome/free-solid-svg-icons';
import { faSmile, faMeh, faFrown } from '@fortawesome/free-solid-svg-icons';
import Rating from '@/components/rating/Rating';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import Comentarios from '@/components/comentario/Comentarios';
import RecetasSimilares from '@/components/receta/recetasSimilares/RecetasSimilares';
import Link from 'next/link';

const RecipePage = () => {
    const router = useRouter();
    const { id } = router.query;
    const [receta, setReceta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [esFavorito, setEsFavorito] = useState(false);
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
                    setFavoritoCambiadoLocalmente(false);
                }
            };

            fetchReceta();
        }
    }, [id, favoritoCambiadoLocalmente]);


    const handleFavorito = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Debes iniciar sesión para agregar a favoritos');
            router.push('/login');
            return;
        }

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

    const ingredientes = receta.ingredientes;
    const categorias = receta.categorias;

    const renderDificultadIcon = () => {
        switch (receta.dificultad) {
            case 'Fácil':
                return <FontAwesomeIcon icon={faSmile} className="text-green-500" />;
            case 'Media':
                return <FontAwesomeIcon icon={faMeh} className="text-yellow-500" />;
            case 'Difícil':
                return <FontAwesomeIcon icon={faFrown} className="text-red-500" />;
            default:
                return null;
        }
    };
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="grid grid-cols-12 grid-rows-6 gap-12 p-6">
                {/* Sección de opciones (izquierda) */}
                <div className="col-span-3 row-span-2 bg-gray-100 p-6 rounded-lg shadow-lg">
                    {/* Nombre del autor */}
                    <Link href={`/perfil/${receta.id_usuario}`}>
    <div className="p-4 flex items-center bg-gray-100 rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105 cursor-pointer">
        <p className="text-lg font-semibold m-5 text-center">
            {receta.nombre_usuario}
        </p>

        <div className="flex justify-center">
            <img
                src={receta.foto_perfil}
                alt="Imagen del Autor"
                className="fixed-size rounded-full mt-3 border-4 border-gray-300 shadow-md"
            />
        </div>
    </div>
</Link>


                    {/* Calificación */}
                    <Rating recetaId={id} className="mb-4" />

                    {/* Corazón favorito centrado */}
                    <div className="flex justify-center items-center mt-6">
                        <FontAwesomeIcon
                            icon={esFavorito ? fullHeart : emptyHeart}
                            onClick={handleFavorito}
                            className={`text-3xl cursor-pointer mb-4 ${esFavorito ? 'text-red-500' : 'text-gray-400 hover:text-red-500'} 
                            transition-all duration-300 transform active:scale-110 animate-bounce`}
                        />
                    </div>
                </div>

                {/* Contenido principal de la receta (centro) */}
                <div className="col-span-6 row-span-4 col-start-4 bg-white rounded-lg shadow-lg p-6 space-y-6">
                    {/* Título */}
                    <h1 className="text-3xl font-bold text-center text-gray-800">{receta.titulo}</h1>

                    {/* Imagen de la receta */}
                    {receta.foto_receta && (
                        <div className="relative h-72">
                            <img
                                src={receta.foto_receta}
                                alt={`Imagen de ${receta.titulo}`}
                                className="w-full h-full object-cover rounded-lg shadow-md"
                            />
                        </div>
                    )}

                    {/* Descripción */}
                    <div className="space-y-4">
                        <p className="text-lg font-medium mb-2 text-gray-800"><strong>Descripción:</strong> {receta.descripcion}</p>

                        {/* Ingredientes */}
                        <p className="text-lg font-medium mb-2 text-gray-800"><strong>Ingredientes:</strong></p>
                        <ul className="list-disc list-inside pl-6 space-y-2">
                            {ingredientes.map((ingrediente, index) => (
                                <li key={index} className="text-gray-700">
                                    <span className="font-semibold">{ingrediente.nombre}</span> : {ingrediente.cantidad}
                                </li>
                            ))}
                        </ul>

                        {/* Instrucciones */}
                        <p className="text-lg font-medium mb-2 text-gray-800"><strong>Instrucciones:</strong></p>
                        <ol className="list-decimal list-inside pl-6 space-y-2">
                            {Array.isArray(instrucciones) && instrucciones.length > 0 ? (
                                instrucciones.map((instruccion, index) => (
                                    <li key={index} className="text-gray-700">
                                        {instruccion.paso}
                                        {instruccion.imagen && (
                                            <img src={instruccion.imagen} alt={`Paso ${index + 1}`} className="mt-2 rounded-lg shadow-sm" />
                                        )}
                                    </li>
                                ))
                            ) : (
                                <li className="text-gray-500">No hay instrucciones disponibles.</li>
                            )}
                        </ol>
                    </div>

                    {/* Detalles adicionales */}
                    <div className="space-y-2">
                        <p className="text-lg font-medium text-gray-800"><strong>Dificultad: </strong>{receta.dificultad} {renderDificultadIcon()}</p>
                        <p className="text-lg font-medium text-gray-800"><strong>Tiempo de Preparación:</strong> {receta.tiempo_preparacion} minutos</p>
                    </div>

                    {/* Categorías */}
                    <div className="flex flex-wrap gap-3">
                        <p className="text-lg font-medium text-gray-800"><strong>Categorías:</strong></p>
                        {categorias.map((categoria, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 px-4 py-2 rounded-md cursor-pointer hover:bg-blue-300 transition-colors">
                                {categoria}
                            </span>
                        ))}
                    </div>

                    {/* Comentarios */}
                    <Comentarios recetaId={id} autorRecetaId={receta.id_usuario} />
                </div>

                {/* Recetas similares (derecha) */}
                <div className="col-span-3 row-span-6 col-start-10 bg-white p-6 rounded-lg shadow-lg">
                    {/* Título de la sección */}
                    <h2 className="text-lg text-center font-semibold text-gray-800 mb-4">Recetas Similares</h2>

                    {/* Recetas Similares Component */}
                    <RecetasSimilares id={id} token={localStorage.getItem('token')} />
                </div>

            </div>

            <Footer />
        </div>
    );



};

export default RecipePage;
