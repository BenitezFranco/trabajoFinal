import { useState, useEffect } from 'react';

const Rating = ({ recetaId }) => {
    const [rating, setRating] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [promedio, setPromedio] = useState(0);
    const [successMessage, setSuccessMessage] = useState('');  // Estado para el mensaje de éxito

    // Definir fetchPromedio fuera del useEffect
    const fetchPromedio = async () => {
        try {
            const response = await fetch(`http://localhost:3000/receta/${recetaId}/promedio`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setPromedio(data.promedio);  // Guardar el promedio en el estado
            }
        } catch (error) {
            console.error('Error al obtener el promedio de calificaciones:', error);
        }
    };

    // Recuperar la calificación existente al cargar la página
    useEffect(() => {
        const fetchCalificacion = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                return;
            }

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

    const handleRating = (value) => {
        if (!submitted || (submitted && rating !== 0)) {
            setRating(value);
        }
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem('token');
    
        if (!token) {
            alert('Debes iniciar sesión para calificar esta receta');
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:3000/receta/${recetaId}/calificar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ puntuacion: rating })
            });
    
            if (response.ok) {
                setSubmitted(true);
                
                // Mostrar el mensaje de éxito
                setSuccessMessage('Calificación enviada con éxito');
                setTimeout(() => setSuccessMessage(''), 3000);  // El mensaje desaparece después de 3 segundos
                
                // Actualizar el promedio después de enviar la calificación
                fetchPromedio();
            } else {
                const errorData = await response.json();
                alert(errorData.error || 'Error al enviar la calificación');
            }
        } catch (error) {
            console.error('Error al calificar la receta:', error);
            alert('Error al calificar la receta. Revisa la consola para más detalles.');
        }
    };

    const handleRecalificar = () => {
        setSubmitted(false);  // Permitir recalificar
        setRating(0);  // Reiniciar la calificación
    };

    return (
        <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Calificar esta receta:</h3>
            
            {/* Mostrar el mensaje de éxito si existe */}
            {successMessage && (
                <div className="mb-4 p-2 bg-green-200 text-green-800 rounded">
                    {successMessage}
                </div>
            )}

            <div className="flex space-x-2 mb-4">
                {[1, 2, 3, 4, 5].map((value) => (
                    <button
                        key={value}
                        onClick={() => handleRating(value)}
                        className={`p-2 rounded-full border ${
                            value <= rating ? 'bg-yellow-400' : 'bg-gray-300'
                        }`}
                        disabled={submitted && rating !== 0}  // Deshabilitar si ya se ha enviado y hay una calificación
                    >
                        {value}★
                    </button>
                ))}
            </div>
            <button
                onClick={submitted ? handleRecalificar : handleSubmit}
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none"
            >
                {submitted ? 'Recalificar' : 'Enviar Calificación'}
            </button>

            {/* Mostrar el promedio de calificaciones */}
            <div className="mt-4">
                <h4 className="text-lg font-medium">Promedio de calificaciones: {promedio}★</h4>
            </div>
        </div>
    );
};

export default Rating;
