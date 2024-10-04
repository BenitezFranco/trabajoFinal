import { useEffect, useState } from 'react';

const Comentarios = ({ recetaId }) => {
    const [comentarios, setComentarios] = useState([]);
    const [nuevoComentario, setNuevoComentario] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchComentarios = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:3000/receta/${recetaId}/comentarios`);
                const data = await response.json();
                console.log(data);
                if (Array.isArray(data)) {
                    setComentarios(data);
                } else {
                    setComentarios([]);
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

    const handleSubmitComentario = async () => {
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
                body: JSON.stringify({ texto: nuevoComentario })
            });

            if (response.ok) {
                const comentarioCreado = await response.json();

                // Asegúrate de que el comentarioCreado incluya la información del usuario
                const usuario = { nombre: "Nombre del Usuario" }; // Reemplaza esto con la lógica para obtener el nombre del usuario
                setComentarios([...comentarios, { ...comentarioCreado, Usuario: usuario }]);
                setNuevoComentario('');
            } else {
                const errorData = await response.json();
                alert(errorData.error || 'Error al enviar el comentario');
            }
        } catch (error) {
            console.error('Error al enviar el comentario:', error);
        }
    };

    return (
        <div className="mt-4">
            <h3 className="text-lg font-medium mb-4">Comentarios:</h3>
            {loading ? (
                <p>Cargando comentarios...</p>
            ) : (
                <div className="space-y-4">
                    {Array.isArray(comentarios) && comentarios.length > 0 ? (
                        comentarios.map((comentario) => (
                            <div key={comentario.id_comentario} className="bg-gray-100 p-4 rounded-lg">
                                <p className="text-sm text-gray-600">
                                    {comentario.Usuario ? comentario.Usuario.nombre : 'Usuario desconocido'}
                                </p>
                                <p>{comentario.texto}</p>
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
                onClick={handleSubmitComentario}
                className="mt-2 bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600"
            >
                Enviar comentario
            </button>
        </div>
    );
};

export default Comentarios;
