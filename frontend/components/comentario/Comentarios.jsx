import { useEffect, useState } from 'react';

const Comentarios = ({ recetaId, autorRecetaId }) => {
    const [comentarios, setComentarios] = useState([]);
    const [nuevoComentario, setNuevoComentario] = useState('');
    const [loading, setLoading] = useState(true);
    const [respuesta, setRespuesta] = useState({});

    useEffect(() => {
        const fetchComentarios = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:3000/receta/${recetaId}/comentarios`);
                if (response.status === 200) {
                    const data = await response.json();
                if (Array.isArray(data)) {
                    setComentarios(data);
                } else {
                    setComentarios([]);
                }
                } else if (response.status === 401 || response.status === 403) {
                    alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
                    localStorage.removeItem('token');
                    router.push('/login');
                }
                
            } catch (error) {
                console.error('Error al obtener comentarios:', error);
                setComentarios([]);
            } finally {
                setLoading(false);
            }
        };
        fetchComentarios();
    }, [recetaId]);

    const handleSubmitComentario = async (id_comentario_padre = null) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Debes iniciar sesión para dejar un comentario');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/receta/${recetaId}/comentarios`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ texto: nuevoComentario, id_comentario_padre })
            });

            if (response.ok) {
                const comentarioCreado = await response.json();
                setComentarios((prev) => {
                    if (id_comentario_padre) {
                        return prev.map(comentario => {
                            if (comentario.id_comentario === id_comentario_padre) {
                                return {
                                    ...comentario,
                                    Respuestas: [...(comentario.Respuestas || []), comentarioCreado]
                                };
                            }
                            return comentario;
                        });
                    }
                    return [...prev, comentarioCreado];
                });
                setNuevoComentario('');
            } else {
                const errorData = await response.json();
                alert(errorData.error || 'Error al enviar el comentario');
            }
        } catch (error) {
            console.error('Error al enviar el comentario:', error);
        }
    };

    const handleReply = (id_comentario) => {
        setRespuesta({ [id_comentario]: true });
    };

    // Obtén el ID del usuario logueado
    const usuarioLogueadoId = localStorage.getItem('usuarioId'); // Asegúrate de que esto sea correcto

    return (
        <div className="mt-4">
            <h3 className="text-lg font-medium mb-4">Comentarios:</h3>
            {loading ? (
                <p>Cargando comentarios...</p>
            ) : (
                <div className="space-y-4">
                    {Array.isArray(comentarios) && comentarios.length > 0 ? (
                        comentarios.map((comentario) => (
                            <div 
                                key={comentario.id_comentario} 
                                className={`p-4 rounded-lg relative ${comentario.id_usuario === autorRecetaId ? 'bg-green-100' : 'bg-gray-100'}`} // Resaltar el comentario del autor de la receta
                            >
                                {comentario.id_usuario === autorRecetaId && (
                                    <span className="absolute top-2 right-2 text-xs text-blue-500 font-bold">Autor</span>
                                )}
                                {comentario.id_usuario === usuarioLogueadoId && (
                                    <span className="absolute top-2 right-16 text-xs text-blue-500 font-bold">Tu comentario</span>
                                )}
                                <p className="text-sm text-gray-600">
                                    {comentario.Usuario ? comentario.Usuario.nombre : ''}
                                </p>
                                <p>{comentario.texto}</p>
                                <button onClick={() => handleReply(comentario.id_comentario)} className="text-blue-500">
                                    Responder
                                </button>

                                {/* Mostrar respuestas si las hay */}
                                {comentario.Respuestas && comentario.Respuestas.length > 0 && (
                                    <div className="ml-4 mt-2">
                                        {comentario.Respuestas.map((respuesta) => (
                                            <div key={respuesta.id_comentario} className="bg-gray-200 p-2 rounded-md">
                                                <p className="text-sm text-gray-600">
                                                    {respuesta.Usuario ? respuesta.Usuario.nombre : ''}
                                                </p>
                                                <p>{respuesta.texto}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Mostrar el campo de respuesta si el usuario quiere responder */}
                                {respuesta[comentario.id_comentario] && (
                                    <div className="mt-2">
                                        <textarea
                                            value={nuevoComentario}
                                            onChange={(e) => setNuevoComentario(e.target.value)}
                                            placeholder="Escribe tu respuesta"
                                            className="mt-2 w-full p-2 border rounded-md"
                                        ></textarea>
                                        <button
                                            onClick={() => handleSubmitComentario(comentario.id_comentario)}
                                            className="mt-2 bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600"
                                        >
                                            Enviar respuesta
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No hay comentarios aún.</p>
                    )}
                </div>
            )}

            <textarea
                value={nuevoComentario}
                onChange={(e) => setNuevoComentario(e.target.value)}
                placeholder="Escribe tu comentario"
                className="mt-4 w-full p-2 border rounded-md"
            ></textarea>

            <button
                onClick={() => handleSubmitComentario()}
                className="mt-2 bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600"
            >
                Enviar comentario
            </button>
        </div>
    );
};

export default Comentarios;
