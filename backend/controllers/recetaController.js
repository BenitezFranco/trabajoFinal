const Receta = require('../models/Receta'); // Modelo de receta
const RecetaCategoria = require('../models/Receta_Categoria'); // Modelo de receta_categoria
const Usuario = require ('../models/Usuario');
const Calificacion = require('../models/Calificacion'); // Modelo de calificación

// Crear una nueva receta
const crearReceta = async (ctx) => {
    const { titulo, descripcion, instrucciones, ingredientes, dificultad, tiempo_preparacion, categorias } = ctx.request.body;
    const id_usuario = ctx.state.user.id_usuario;

    const nuevaReceta = await Receta.create({
        titulo,
        descripcion,
        instrucciones,
        ingredientes,
        dificultad,
        tiempo_preparacion,
        fecha_publicacion: new Date(), 
        id_usuario,
    });

    for (const id_categoria of categorias) {
        await RecetaCategoria.create({
            id_receta: nuevaReceta.id_receta,
            id_categoria,
        });
    }

    ctx.body = { message: 'Receta creada exitosamente' };
};

// Obtener una receta por ID
const obtenerReceta = async (ctx) => {
    try {
        const recetaId = ctx.params.id;
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
            attributes: ['nombre']
        });

        if (!usuario) {
            ctx.status = 404;
            ctx.body = { error: 'Usuario no encontrado' };
            return;
        }

        const recetaConUsuario = {
            ...receta.toJSON(),
            nombre_usuario: usuario.nombre
        };

        ctx.status = 200;
        ctx.body = recetaConUsuario;
        
    } catch (error) {
        ctx.status = 500;
        ctx.body = { error: 'Error al obtener la receta' };
    }
};

// Calificar una receta

    const calificarReceta = async (ctx) => {
        const puntuacion = ctx.request.body.puntuacion; // Obtener la puntuación del cuerpo de la solicitud
        const id_receta = ctx.params.id; // Obtener el id_receta desde los parámetros de la ruta
        const id_usuario = ctx.state.user.id_usuario; // Obtener el id del usuario autenticado

        console.log('ctx: ', ctx);
        console.log('id_usuario: ', id_usuario);

        try {
            // Validar que la puntuación esté dentro del rango permitido
            if (puntuacion < 1 || puntuacion > 5) {
                ctx.status = 400;
                ctx.body = { error: 'La puntuación debe estar entre 1 y 5.' };
                return;
            }

            // Crear la calificación en la base de datos
            const nuevaCalificacion = await Calificacion.create({
                id_receta, // Usar el id_receta de los parámetros
                id_usuario,
                puntuacion
            });

            ctx.status = 201; // Crear con éxito
            ctx.body = { message: 'Calificación creada exitosamente', id_calificacion: nuevaCalificacion.id_calificacion };
        } catch (error) {
            console.error('Error al calificar la receta:', error);
            ctx.status = 500;
            ctx.body = { error: 'Error al calificar la receta.' };
        }
    };


module.exports = { calificarReceta };

module.exports = { crearReceta, obtenerReceta, calificarReceta };
