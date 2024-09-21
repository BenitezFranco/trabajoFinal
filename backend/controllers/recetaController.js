const Receta = require('../models/Receta'); // Modelo de receta
const RecetaCategoria = require('../models/Receta_categoria'); // Modelo de receta_categoria

const crearReceta = async (ctx) => {
    const { titulo, descripcion, instrucciones, ingredientes, dificultad, tiempo_preparacion, categorias } = ctx.request.body;

    // Obtén el ID del usuario autenticado desde el token
    const id_usuario = ctx.state.user.id_usuario;

    // Inserta la receta en la base de datos
    const nuevaReceta = await Receta.create({
        titulo,
        descripcion,
        instrucciones,
        ingredientes,
        dificultad,
        tiempo_preparacion,
        fecha_publicacion: new Date(), // Fecha actual
        id_usuario, // Asociar receta con el usuario autenticado
    });

    // Inserta las categorías asociadas a la receta
    for (const id_categoria of categorias) {
        await RecetaCategoria.create({
            id_receta: nuevaReceta.id_receta,
            id_categoria,
        });
    }

    ctx.body = { message: 'Receta creada exitosamente' };
};

module.exports= {crearReceta};