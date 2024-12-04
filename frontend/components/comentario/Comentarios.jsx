import { useEffect, useState } from 'react';

const Comentarios = ({ recetaId, autorRecetaId }) => {
    const [comentarios, setComentarios] = useState([]);
    const [nuevoComentario, setNuevoComentario] = useState('');
    const [loading, setLoading] = useState(true);
    const [respuesta, setRespuesta] = useState({});
    const [respuestaTexto, setRespuestaTexto] = useState({});

    // Mueve fetchComentarios fuera de useEffect para que pueda reutilizarse
    const fetchComentarios = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3000/receta/${recetaId}/comentarios`);
            if (response.status === 200) {
                const data = await response.json();
                setComentarios(Array.isArray(data) ? data : []);
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

    useEffect(() => {
        fetchComentarios(); // Llamada inicial para cargar comentarios
    }, [recetaId]);

    const handleSubmitComentario = async (id_comentario_padre = null) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Debes iniciar sesión para dejar un comentario');
            return;
        }

        try {
            const texto = id_comentario_padre
                ? respuestaTexto[id_comentario_padre] || ''
                : nuevoComentario;

            if (!texto.trim()) {
                alert('El comentario no puede estar vacío.');
                return;
            }

            const response = await fetch(`http://localhost:3000/receta/${recetaId}/comentarios`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ texto, id_comentario_padre }),
            });

            if (response.ok) {
                await fetchComentarios(); // Recarga los comentarios después de enviar uno nuevo

                // Limpia el campo de texto correspondiente
                if (id_comentario_padre) {
                    setRespuestaTexto((prev) => ({ ...prev, [id_comentario_padre]: '' }));
                } else {
                    setNuevoComentario('');
                }
            } else {
                const errorData = await response.json();
                alert(errorData.error || 'Error al enviar el comentario');
            }
        } catch (error) {
            console.error('Error al enviar el comentario:', error);
        }
    };

    const handleReply = (id_comentario) => {
        setRespuesta((prev) => ({ ...prev, [id_comentario]: true }));
    };

    const usuarioLogueadoId = localStorage.getItem('usuarioId');

    return (
        <div className="mt-4">
            <p className="text-lg font-medium mb-4">Comentarios:</p>
            {loading ? (
                <p>Cargando comentarios...</p>
            ) : (
                <div className="space-y-4">
                    {comentarios.length > 0 ? (
                        comentarios.map((comentario) => (
                            <div
                                key={comentario.id_comentario}
                                className={`p-4 rounded-lg relative ${
                                    comentario.id_usuario === autorRecetaId
                                        ? 'bg-green-100'
                                        : 'bg-gray-100'
                                }`}
                            >
                                {comentario.id_usuario === autorRecetaId && (
                                    <span className="absolute top-2 right-2 text-xs text-blue-500 font-bold">
                                        Autor
                                    </span>
                                )}
                                {comentario.id_usuario === usuarioLogueadoId && (
                                    <span className="absolute top-2 right-16 text-xs text-blue-500 font-bold">
                                        Tu comentario
                                    </span>
                                )}
                                <p className="text-sm text-gray-600">
                                    {comentario.Usuario ? comentario.Usuario.nombre : ''}
                                </p>
                                <p>{comentario.texto}</p>
                                <button
                                    onClick={() => handleReply(comentario.id_comentario)}
                                    className="text-blue-600"
                                >
                                    Responder
                                </button>

                                {comentario.Respuestas && comentario.Respuestas.length > 0 && (
                                    <div className="ml-4 mt-2">
                                        {comentario.Respuestas.map((respuesta) => (
                                            <div
                                                key={respuesta.id_comentario}
                                                className="bg-gray-200 p-2 rounded-md"
                                            >
                                                <p className="text-sm text-gray-600">
                                                    {respuesta.Usuario
                                                        ? respuesta.Usuario.nombre
                                                        : ''}
                                                </p>
                                                <p>{respuesta.texto}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {respuesta[comentario.id_comentario] && (
                                    <div className="mt-2">
                                        <textarea
                                            value={respuestaTexto[comentario.id_comentario] || ''}
                                            onChange={(e) =>
                                                setRespuestaTexto((prev) => ({
                                                    ...prev,
                                                    [comentario.id_comentario]: e.target.value,
                                                }))
                                            }
                                            placeholder="Escribe tu respuesta"
                                            className="mt-2 w-full p-2 border rounded-md"
                                        ></textarea>
                                        <button
                                            onClick={() =>
                                                handleSubmitComentario(comentario.id_comentario)
                                            }
                                            className="mt-2 bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-500"
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
                className="mt-2 bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-500"
            >
                Enviar comentario
            </button>
        </div>
    );
};

export default Comentarios;
