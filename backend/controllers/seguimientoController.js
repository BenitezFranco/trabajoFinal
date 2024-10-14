// Importa los modelos necesarios
const Seguimiento = require('../models/Seguimiento');
const Usuario = require('../models/Usuario');

// Función para seguir a un usuario
const seguirUsuario = async (ctx) => {
    const { id_usuario_seguido } = ctx.request.body;
    const id_usuario_seguidor = ctx.state.user.id_usuario;
    
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

// Función para dejar de seguir a un usuario
const dejarDeSeguirUsuario = async (ctx) => {
    const { id_usuario_seguido } = ctx.request.body;
    const id_usuario_seguidor = ctx.state.user.id_usuario;

    try {
        const seguimiento = await Seguimiento.findOne({
            where: { id_usuario_seguidor, id_usuario_seguido }
        });

        if (!seguimiento) {
            ctx.status = 404;
            ctx.body = { error: 'No sigues a este usuario.' };
            return;
        }

        await seguimiento.destroy();
        ctx.status = 200;
        ctx.body = { message: 'Has dejado de seguir al usuario.' };
    } catch (error) {
        ctx.status = 500;
        ctx.body = { error: 'Error al dejar de seguir al usuario.' };
    }
};

// Nueva función para obtener el perfil de un usuario

const obtenerPerfil = async (ctx) => {
    try {
        const id_usuario = ctx.params.id;
        // Obtener el perfil del usuario
        const usuario = await Usuario.findByPk(id_usuario);
        if (!usuario) {
            ctx.status = 404;
            ctx.body = { error: 'Usuario no encontrado' };
            return;
        }

        // Log para verificar la respuesta antes de enviar
        //console.log('Perfil encontrado:', usuario);

        // Enviar la respuesta con el perfil del usuario
        ctx.status = 200;
        ctx.body = usuario;
        
    } catch (error) {
        ctx.status = 500;
        ctx.body = { error: 'Error al obtener el perfil del usuario.' };
    }
};


const obtenerSeguidores = async (ctx) => {
    const id_usuario_seguido = ctx.state.user.id_usuario; // Usuario autenticado

    try {
        const seguidores = await Seguimiento.findAll({
            where: { id_usuario_seguido }, // Buscar quienes siguen al usuario autenticado
            include: {
                model: Usuario,
                as: 'seguidor', // Alias para la relación
                attributes: ['id_usuario', 'nombre']
            }
        });

        ctx.body = seguidores;
    } catch (error) {
        ctx.status = 500;
        ctx.body = { error: 'Error al obtener seguidores.' };
    }
};

module.exports = {
    seguirUsuario,
    dejarDeSeguirUsuario,
    obtenerSeguimientos,
    obtenerPerfil,
    obtenerSeguidores // Exporta la nueva función
};
