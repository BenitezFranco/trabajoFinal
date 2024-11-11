import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Asegúrate de importar FontAwesomeIcon
import { faStar } from '@fortawesome/free-solid-svg-icons'; // Importa el ícono de la estrella
const Rating = ({ recetaId }) => {
    const [rating, setRating] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [promedio, setPromedio] = useState(0);
    const [successMessage, setSuccessMessage] = useState('');  // Estado para el mensaje de éxito
    const [errorMessage, setErrorMessage] = useState(''); // Estado para el mensaje de error

    // Función para obtener el promedio de calificaciones
    const fetchPromedio = async () => {
        try {
            const response = await fetch(`http://localhost:3000/receta/${recetaId}/promedio`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 200) {
                const data = await response.json();
                setPromedio(data.promedio);
            } else if (response.status === 401 || response.status === 403) {
                alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
                localStorage.removeItem('token');
                router.push('/login');
            }
        } catch (error) {
            console.error('Error al obtener el promedio de calificaciones:', error);
        }
    };

    // Recuperar la calificación existente al cargar la página
    useEffect(() => {
        const fetchCalificacion = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const response = await fetch(`http://localhost:3000/receta/${recetaId}/calificacion`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setRating(data.puntuacion);  // Mostrar la calificación existente
                    setSubmitted(true);  // Mostrar que ya se ha enviado la calificación
                }
            } catch (error) {
                console.error('Error al obtener la calificación:', error);
            }
        };

        fetchCalificacion();
    }, [recetaId]);

    // Obtener el promedio de calificaciones al cargar la página
    useEffect(() => {
        fetchPromedio();
    }, [recetaId]);

    const handleRating = async (value) => {
        if (!submitted || (submitted && rating !== 0)) {
            setRating(value);  // Actualizar la calificación seleccionada
            const token = localStorage.getItem('token');

            if (!token) {
                setErrorMessage('Debes iniciar sesión para calificar esta receta');
                return;
            }

            if (value < 1 || value > 5) {
                setErrorMessage('Por favor, selecciona una calificación entre 1 y 5.');
                return;
            }

            try {
                const response = await fetch(`http://localhost:3000/receta/${recetaId}/calificar`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ puntuacion: value })
                });

                if (response.ok) {
                    setSubmitted(true);
                    setSuccessMessage('¡Calificación enviada con éxito!');
                    setTimeout(() => setSuccessMessage(''), 2000);  // El mensaje desaparece después de 3 segundos
                    fetchPromedio();
                    setErrorMessage(''); // Limpiar el mensaje de error
                } else {
                    const errorData = await response.json();
                    setErrorMessage(errorData.error || 'Error al enviar la calificación');
                }
            } catch (error) {
                console.error('Error al calificar la receta:', error);
                setErrorMessage('Error al calificar la receta. Revisa la consola para más detalles.');
            }
        }
    };

    const handleRecalificar = () => {
        setSubmitted(false);  // Permitir recalificar
        setRating(0);  // Reiniciar la calificación
        setErrorMessage(''); // Limpiar el mensaje de error al recalificar
    };

    return (
        <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Calificar esta receta:</h3>

            {/* Mostrar el mensaje de éxito si existe */}
            {successMessage && (
                <div className="mb-4 p-2 bg-green-200 text-green-800 rounded-lg shadow-md">
                    {successMessage}
                </div>
            )}

            {/* Mostrar el mensaje de error si existe */}
            {errorMessage && (
                <div className="mb-4 p-2 bg-red-200 text-red-800 rounded-lg shadow-md">
                    {errorMessage}
                </div>
            )}

            <div className="flex space-x-2 mb-4">
                {[1, 2, 3, 4, 5].map((value) => (
                    <button
                        key={value}
                        onClick={() => handleRating(value)}
                        className={`p-2 rounded-full border ${value <= rating ? 'bg-yellow-400' : 'bg-gray-300'
                            } flex items-center justify-center`} // Elimina el texto
                        disabled={submitted && rating !== 0} // Deshabilitar si ya se ha enviado y hay una calificación
                    >
                        <FontAwesomeIcon
                            icon={faStar} // Solo el ícono de la estrella
                            className={`text-xl ${value <= rating ? 'text-yellow-500' : 'text-gray-400'}`} // Color dinámico
                        />
                    </button>
                ))}
            </div>


            {/* Botón de recalificar solo si ya se ha enviado una calificación */}
            {submitted && (
                <button
                    onClick={handleRecalificar}
                    className="mt-4 bg-blue-500 text-white font-bold py-2 px-6 rounded-md hover:bg-blue-600 transition-colors duration-200 focus:outline-none shadow-lg"
                >
                    Recalificar
                </button>
            )}

            {/* Mostrar el promedio de calificaciones */}
            <div className="mt-4">
    <h4 className="text-lg font-medium mb-2">Promedio de calificaciones:</h4>
    <div className="flex items-center">
        {Array.from({ length: 5 }, (_, index) => {
            const isFull = promedio >= index + 1;  // Estrella llena
            const isHalf = promedio > index && promedio < index + 1; // Media estrella

            return (
                <FontAwesomeIcon
                    key={index}
                    icon={faStar}
                    className={`text-xl ${
                        isFull
                            ? 'text-yellow-600' // Estrella llena
                            : isHalf
                            ? 'text-yellow-300' // Media estrella
                            : 'text-gray-300' // Estrella vacía
                    }`}
                />
            );
        })}
        <span className="ml-2 text-lg text-gray-600">
            {isNaN(Number(promedio)) || promedio === null ? '0.0' : Number(promedio).toFixed(1)}
        </span>
    </div>
</div>




        </div>
    );
};

export default Rating;
