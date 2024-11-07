const Favorito = require('../models/Favorito');
const Receta = require('../models/Receta');
// Agregar receta a favoritos
const agregarFavorito = async (ctx) => {
    const id_usuario = ctx.state.user.id_usuario;
    const { id } = ctx.params; // id de la receta

    try {
        // Verificar si ya está en favoritos
        const favoritoExistente = await Favorito.findOne({ where: { id_usuario, id_receta: id } });
        if (favoritoExistente) {
            ctx.status = 400;
            ctx.body = { message: 'Esta receta ya está en favoritos.' };
            return;
        }

        // Crear el favorito
        const nuevoFavorito = await Favorito.create({ id_usuario, id_receta: id });
        ctx.status = 201;
        ctx.body = { message: 'Receta agregada a favoritos.', favorito: nuevoFavorito };
    } catch (error) {
        ctx.status = 500;
        ctx.body = { message: 'Error al agregar la receta a favoritos.' };
    }
};

// Eliminar receta de favoritos
const eliminarFavorito = async (ctx) => {
    const id_usuario = ctx.state.user.id_usuario;
    const { id } = ctx.params; // id de la receta

    try {
        const favorito = await Favorito.findOne({ where: { id_usuario, id_receta: id } });

        if (!favorito) {
            ctx.status = 404;
            ctx.body = { message: 'Esta receta no está en favoritos.' };
            return;
        }

        await favorito.destroy();
        ctx.status = 200;
        ctx.body = { message: 'Receta eliminada de favoritos.' };
    } catch (error) {
        ctx.status = 500;
        ctx.body = { message: 'Error al eliminar la receta de favoritos.' };
    }
};

// Obtener las recetas favoritas del usuario

const obtenerFavoritos = async (ctx) => {
    const { id } = ctx.params; // Asegúrate de que el ID se esté obteniendo correctamente

    try {
        const favoritos = await Favorito.findAll({
            where: { id_usuario: id }, // Verifica que este campo corresponda al ID del usuario
            include: [{ model: Receta }], // Incluye la información de la receta
        });

        if (favoritos.length === 0) {
            ctx.status = 404;
            ctx.body = { message: 'No hay recetas favoritas para mostrar.' };
            return;
        }

        ctx.body = favoritos;
    } catch (error) {
        console.error('Error al obtener favoritos:', error);
        ctx.status = 500;
        ctx.body = { error: 'Error al obtener las recetas favoritas.' };
    }
};


const estaEnFavoritos = async (ctx) => {
    const { id } = ctx.params; // ID de la receta
    const usuarioId = ctx.state.user.id_usuario; // ID del usuario autenticado

    const favorito = await Favorito.findOne({
        where: {
            id_usuario: usuarioId,
            id_receta: id
        }
    });

    if (favorito) {
        ctx.body = { estaEnFavoritos: true };
    } else {
        ctx.body = { estaEnFavoritos: false };
    }
};

module.exports = {
    agregarFavorito,
    eliminarFavorito,
    obtenerFavoritos,
    estaEnFavoritos 
};
