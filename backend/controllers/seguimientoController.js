const Seguimiento = require('../models/Seguimiento');
const Usuario = require('../models/Usuario');

// Función para seguir a un usuario
const seguirUsuario = async (ctx) => {
    const { id_usuario_seguido } = ctx.request.body;
    const id_usuario_seguidor = ctx.state.user.id_usuario;
    console.log('seguidor ', ctx);
    try {
        const usuarioSeguido = await Usuario.findByPk(id_usuario_seguido);
        if (!usuarioSeguido) {
            ctx.status = 404;
            ctx.body = { error: 'Usuario no encontrado' };
            return;
        }

        const seguimientoExistente = await Seguimiento.findOne({
            where: { id_usuario_seguidor, id_usuario_seguido }
        });

        if (seguimientoExistente) {
            ctx.status = 400;
            ctx.body = { error: 'Ya sigues a este usuario.' };
            return;
        }

        const nuevoSeguimiento = await Seguimiento.create({
            id_usuario_seguidor,
            id_usuario_seguido
        });

        ctx.status = 201;
        ctx.body = { message: 'Usuario seguido con éxito', seguimiento: nuevoSeguimiento };
    } catch (error) {
        ctx.status = 500;
        ctx.body = { error: 'Error al seguir usuario.' };
    }
};

// Función para obtener la lista de usuarios seguidos
const obtenerSeguimientos = async (ctx) => {
    const id_usuario_seguidor = ctx.state.user.id_usuario;
    console.log('usuario', id_usuario_seguidor);

    try {
        const seguimientos = await Seguimiento.findAll({
            where: { id_usuario_seguidor },
            include: {
                model: Usuario,
                as: 'seguido', // Alias para la relación
                attributes: ['id_usuario', 'nombre']
            }
        });

        ctx.body = seguimientos;
    } catch (error) {
        ctx.status = 500;
        ctx.body = { error: 'Error al obtener seguimientos.' };
    }
};

module.exports = {
    seguirUsuario,
    obtenerSeguimientos,
};
