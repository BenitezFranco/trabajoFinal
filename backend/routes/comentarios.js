const Router = require('koa-router');
const Comentario = require('../models/Comentario'); // Importa el modelo de comentarios
const Usuario = require('../models/Usuario');
const authenticate = require('../middleware/authMiddleware');

const router = new Router();

// Obtener comentarios de una receta, incluyendo las respuestas
router.get('/receta/:id/comentarios', async (ctx) => {
    const id_receta = ctx.params.id;
    try {
        const comentarios = await Comentario.findAll({
            where: { id_receta, id_comentario_padre: null }, // Solo comentarios principales
            include: [
                {
                    model: Usuario,
                    attributes: ['nombre', 'foto_perfil']
                },
                {
                    model: Comentario,
                    as: 'Respuestas', // Alias para las respuestas
                    include: [
                        { model: Usuario, attributes: ['nombre', 'foto_perfil'] }
                    ]
                }
            ]
        });
        ctx.body = comentarios;
    } catch (error) {
        console.error('Error al obtener los comentarios:', error);
        ctx.status = 500;
        ctx.body = { error: 'Error al obtener los comentarios' };
    }
});

// Crear un comentario o respuesta en una receta (protegida)
router.post('/receta/:id/comentarios', authenticate, async (ctx) => {
    const id_receta = ctx.params.id;
    const id_usuario = ctx.state.user.id_usuario;
    const { texto, id_comentario_padre } = ctx.request.body; // Agregar el id_comentario_padre

    try {
        const nuevoComentario = await Comentario.create({
            texto,
            id_receta,
            id_usuario,
            id_comentario_padre: id_comentario_padre || null
        });
        ctx.status = 201;
        ctx.body = nuevoComentario;
    } catch (error) {
        console.error('Error al crear el comentario:', error);
        ctx.status = 500;
        ctx.body = { error: 'Error al crear el comentario' };
    }
});

// Editar un comentario (protegido)
router.put('/comentarios/:id', authenticate, async (ctx) => {
    const id_comentario = ctx.params.id;
    const { texto } = ctx.request.body; // Texto editado

    try {
        const comentario = await Comentario.findByPk(id_comentario);
        if (!comentario) {
            ctx.status = 404;
            ctx.body = { error: 'Comentario no encontrado' };
            return;
        }

        // Asegurarse de que el usuario que edita es el autor del comentario
        if (comentario.id_usuario !== ctx.state.user.id_usuario) {
            ctx.status = 403;
            ctx.body = { error: 'No tienes permiso para editar este comentario' };
            return;
        }

        comentario.texto = texto;
        await comentario.save();

        ctx.body = comentario;
    } catch (error) {
        console.error('Error al editar el comentario:', error);
        ctx.status = 500;
        ctx.body = { error: 'Error al editar el comentario' };
    }
});

module.exports = router;
