const Receta = require('../models/Receta'); // Modelo de receta
const RecetaCategoria = require('../models/Receta_categoria'); // Modelo de receta_categoria
const Usuario = require ('../models/Usuario');

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

const obtenerReceta = async (ctx) => {
    try {
        const recetaId = ctx.params.id;//atento a como enviamos el id
        const receta = await Receta.findOne({
            where: { id_receta: recetaId }
        });

        if (!receta) {
            ctx.status = 404;
            ctx.body = { error: 'Receta no encontrada' };
            return;
        }

        const usuario = await Usuario.findOne({
            where: { id_usuario: receta.id_usuario },
            attributes: ['nombre'] // Solo devolver el nombre
        });

        if (!usuario) {
            ctx.status = 404;
            ctx.body = { error: 'Usuario no encontrado' };
            return;
        }

        // Agregar el nombre del usuario a la receta
        const recetaConUsuario = {
            ...receta.toJSON(), // Convertir el modelo a un objeto plano
            nombre_usuario: usuario.nombre
        };

        ctx.status = 200;
        ctx.body = recetaConUsuario;
        
    } catch (error) {
        ctx.status = 500;
        ctx.body = { error: 'Error al obtener la receta' };
    }
};
module.exports= {crearReceta, obtenerReceta};