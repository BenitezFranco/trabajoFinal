import Link from 'next/link';
import { useState } from 'react';

const CardRecetaC = ({ item }) => {
    const [isCompleting, setIsCompleting] = useState(false); // Estado para deshabilitar el botón
    const [isCompleted, setIsCompleted] = useState(item.completado || false); // Estado para marcar la receta como completada
    const fotoUrl = item.foto_receta || null;

    const handleComplete = async () => {
        setIsCompleting(true); // Deshabilitar el botón mientras se procesa
        try {
            const response = await fetch(`http://localhost:3000/completarReceta/${item.id_rel_cal_rec}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setIsCompleted(true); // Marcar como completada
            } else {
                console.error('Error al completar la receta');
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
        } finally {
            setIsCompleting(false); // Reactivar el botón en caso de error o éxito
        }
    };

    return (
        <div
            className={`relative rounded-lg shadow-sm transform transition-all duration-200 ${
                isCompleted ? 'bg-gray-200 cursor-not-allowed' : 'hover:scale-102 hover:shadow-lg hover:bg-gray-50'
            }`}
            style={{ height: '220px' }} // Reducir la altura de la tarjeta
        >
            {/* Imagen de la receta */}
            <Link href={`/recipe/${item.id_receta}`} className="text-lg font-medium">
                <div
                    className={`relative h-24 overflow-hidden rounded-t-lg transition-all duration-200 ${
                        isCompleted ? 'opacity-50' : 'hover:opacity-80'
                    }`}
                >
                    <img
                        src={fotoUrl}
                        alt={`Imagen de ${item.titulo}`}
                        className="w-full h-full object-cover rounded-t-lg transition-all duration-300"
                    />
                </div>
            </Link>
            {/* Título y dificultad */}
            <div className="p-2 text-center">
                <h3
                    className={`text-lg font-bold mb-1 transition-all duration-200 ${
                        isCompleted ? 'text-gray-500' : 'hover:text-blue-500 truncate'
                    }`}
                    style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} // Truncar título largo
                >
                    {item.titulo}
                </h3>
                {/* Botón completar */}
                <button
                    onClick={handleComplete}
                    disabled={isCompleting || isCompleted}
                    className={`mt-2 px-4 py-2 rounded text-white font-medium ${
                        isCompleted
                            ? 'bg-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-500'
                    }`}
                >
                    {isCompleted ? 'Completo' : isCompleting ? 'Completando...' : 'Completar'}
                </button>
            </div>
        </div>
    );
};

export const CardGrid = ({ recetas }) => {
    return (
        <div className="grid grid-cols-7 gap-4">
            {recetas.map((receta) => (
                <CardRecetaC key={receta.id_receta} item={receta} />
            ))}
        </div>
    );
};

export default CardRecetaC;
