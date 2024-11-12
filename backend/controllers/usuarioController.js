const Usuario = require('../models/Usuario'); 

const editarUsuario = async (ctx) => {
    const { id } = ctx.params;
    const { es_visible, presentacion, descripcion_breve, foto_perfil } = ctx.request.body;

    try {
        console.log(id);
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            ctx.status = 404;
            ctx.body = { error: 'Usuario no encontrado' };
            return;
        }

        // Actualizar los campos necesarios
        await usuario.update({ 
            es_visible, 
            presentacion, 
            descripcion_breve, 
            foto_perfil 
        });

        ctx.body = { message: 'Usuario actualizado exitosamente', usuario };
    } catch (error) {
        ctx.status = 500;
        ctx.body = { error: error.message };
    }
};

const obtenerUsuario =  async (ctx) => {
    const usuarioId = ctx.state.user.id_usuario;
    const usuario = await Usuario.findByPk(usuarioId);

    if (usuario) {
        ctx.body = usuario;
    } else {
        ctx.status = 404;
        ctx.body = { error: 'Usuario no encontrado' };
    }
}
module.exports = {editarUsuario, obtenerUsuario};