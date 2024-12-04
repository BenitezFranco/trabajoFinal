import Link from 'next/link';
import { useState } from 'react';

const CardRecetaC = ({ item }) => {
    const [isCompleting, setIsCompleting] = useState(false);
    const [isCompleted, setIsCompleted] = useState(item.completado);
    const fotoUrl = item.foto_receta || null;

    const handleComplete = async (status) => {
        setIsCompleting(true);
        try {
            const response = await fetch(`http://localhost:3000/completarReceta/${item.id_rel_cal_rec}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completado: status }),
            });

            if (response.ok) {
                setIsCompleted(status);
            } else {
                console.error('Error al cambiar el estado de completado');
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
        } finally {
            setIsCompleting(false);
        }
    };

    const cardBackgroundClass = isCompleted === true
        ? 'bg-green-100'
        : isCompleted === false
        ? 'bg-red-100'
        : 'bg-gray-50 hover:bg-gray-100';

    return (
        <div className="relative rounded-lg shadow-md transform transition-all duration-200 hover:scale-105">
            <Link href={`/recipe/${item.id_receta}`} className="text-lg font-medium">
                <div className={`relative h-40 overflow-hidden rounded-t-lg transition-all duration-200 ${
                        isCompleted !== null ? 'opacity-80' : 'hover:opacity-90'
                    }`}
                >
                    <img
                        src={fotoUrl}
                        alt={`Imagen de ${item.titulo}`}
                        className="w-full h-full object-cover rounded-t-lg transition-all duration-300"
                    />
                </div>
            </Link>

            <div className={`p-4 text-center rounded-b-lg ${cardBackgroundClass}`}>
                <h3
                    className={`text-sm font-semibold mb-2 transition-all duration-200 ${
                        isCompleted === true
                            ? 'text-green-800'
                            : isCompleted === false
                            ? 'text-red-800'
                            : 'text-gray-800 hover:text-blue-600 truncate'
                    }`}
                    style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                >
                    {item.titulo}
                </h3>

                <div className="flex flex-col space-y-2 mt-2">
                    {/* Botón Realizado */}
                    <button
                        onClick={() => handleComplete(true)}
                        disabled={isCompleting || isCompleted === true}
                        className={`w-full px-4 py-2 text-xs rounded-lg font-medium ${
                            isCompleted === true
                                ? 'bg-green-300 text-gray-500 cursor-not-allowed'
                                : 'bg-white text-black hover:bg-green-200'
                        }`}
                    >
                        {isCompleting && isCompleted !== true ? (
                            <span className="animate-spin">🔄</span> // Spinner
                        ) : (
                            'Realizado'
                        )}
                    </button>

                    {/* Botón No Realizado */}
                    <button
                        onClick={() => handleComplete(false)}
                        disabled={isCompleting || isCompleted === false}
                        className={`w-full px-4 py-2 text-xs rounded-lg font-medium ${
                            isCompleted === false
                                ? 'bg-red-300 text-gray-500 cursor-not-allowed'
                                : 'bg-white text-black hover:bg-red-200'
                        }`}
                    >
                        {isCompleting && isCompleted !== false ? (
                            <span className="animate-spin">🔄</span> // Spinner
                        ) : (
                            'No Realizado'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export const CardGrid = ({ recetas }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {recetas.map((receta) => (
                <CardRecetaC key={receta.id_rel_cal_rec} item={receta} />
            ))}
        </div>
    );
};

export default CardRecetaC;
