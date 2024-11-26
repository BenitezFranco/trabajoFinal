import { useState, useEffect } from 'react';
import CardRecetaP from '../cards/receta/CardRecetaP';

const SearchGrid = ({ results }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false); 
    const [loadedImages, setLoadedImages] = useState({});

    const itemsPerPage = 3;  // Mostramos 3 tarjetas a la vez

    useEffect(() => {
        setCurrentIndex(0);  // Reinicia el carrusel cuando los resultados cambian
        setShowResults(false);
        setTimeout(() => setShowResults(true), 100); 
    }, [results]);

    const handleImageLoad = (id) => {
        setLoadedImages((prev) => ({ ...prev, [id]: true }));
    };

    const nextSlide = () => {
        if (currentIndex < results.length - itemsPerPage) {
            setCurrentIndex(currentIndex + itemsPerPage);
        }
    };

    const prevSlide = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - itemsPerPage);
        }
    };

    return (
        <div className="max-w-6xl mx-auto mt-8 px-4 pb-8">
            <div className="relative">
                <div className="overflow-hidden">
                    <div 
                        className="flex transition-transform duration-300"
                        style={{ transform: `translateX(-${(currentIndex / itemsPerPage) * 100}%)`, display: 'flex' }}
                    >
                        {loading ? (
                            <div className="w-full text-center">Cargando...</div>
                        ) : results.length === 0 ? (
                            <div className="w-full text-center">No hay resultados para mostrar.</div>
                        ) : (
                            results.map((item) => (
                                <div
                                    key={item.id_receta}
                                    className="w-full sm:w-1/3 md:w-1/3 lg:w-1/3 p-2 transition-opacity duration-500"
                                    style={{ flex: '0 0 33.33%' }}  // Asegura que las tarjetas ocupen un 33.33% del contenedor
                                >
                                    <CardRecetaP
                                        item={item}
                                        onLoadImage={() => handleImageLoad(item.id_receta)}
                                        loaded={loadedImages[item.id_receta]} 
                                    />
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Botones de navegación */}
                <div className="absolute top-1/2 left-0 transform -translate-y-1/2 z-10">
                    <button
                        onClick={prevSlide}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={currentIndex === 0}
                    >
                        &lt;
                    </button>
                </div>

                <div className="absolute top-1/2 right-0 transform -translate-y-1/2 z-10">
                    <button
                        onClick={nextSlide}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={currentIndex >= results.length - itemsPerPage}
                    >
                        &gt;
                    </button>
                </div>
            </div>

            {/* Indicador de la página actual */}
            <div className="flex justify-center mt-6 space-x-2">
                <span className="px-4 py-2 text-gray-700">
                    {Math.ceil((currentIndex + 1) / itemsPerPage)} de {Math.ceil(results.length / itemsPerPage)}
                </span>
            </div>
        </div>
    );
};

export default SearchGrid;
