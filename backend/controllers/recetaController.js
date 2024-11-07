const Receta = require('../models/Receta'); // Modelo de receta
const RecetaCategoria = require('../models/Receta_Categoria'); // Modelo de receta_categoria
const Usuario = require('../models/Usuario');
const Calificacion = require('../models/Calificacion'); // Modelo de calificación
const Categoria = require('../models/Categoria');
const RecetaIngrediente = require('../models/Receta_Ingrediente');
const Ingrediente = require('../models/Ingrediente');
const { Op } = require('sequelize');

// Crear una nueva receta
const crearReceta = async (ctx) => {
    const { titulo, descripcion, instrucciones, ingredientes, dificultad, tiempo_preparacion, categorias, foto_receta } = ctx.request.body;
    const id_usuario = ctx.state.user.id_usuario;

    const nuevaReceta = await Receta.create({
        titulo,
        descripcion,
        instrucciones,
        dificultad,
        tiempo_preparacion,
        fecha_publicacion: new Date(),
        id_usuario,
        foto_receta
    });

    for (const id_categoria of categorias) {
        await RecetaCategoria.create({
            id_receta: nuevaReceta.id_receta,
            id_categoria,
        });
    }
    for (const { id_ingrediente, cantidad } of ingredientes) {
        await RecetaIngrediente.create({
            id_receta: nuevaReceta.id_receta,
            id_ingrediente, // ID del ingrediente
            cantidad, // Cantidad del ingrediente
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

        const idsCategoria = await RecetaCategoria.findAll({
            where: {
                id_receta: receta.id_receta
            },
            attributes: ['id_categoria']
        })

        const ids = idsCategoria.map(item => item.id_categoria);

        const categorias = await Categoria.findAll({
            where: {
                id_categoria: { [Op.in]: ids }
            },
            attributes: ['nombre']
        });


        const idsIngrediente = await RecetaIngrediente.findAll({
            where: {
                id_receta: receta.id_receta
            },
            attributes: ['id_ingrediente', 'cantidad'] // Asegúrate de obtener también la cantidad
        });

        const idsIng = idsIngrediente.map(item => item.id_ingrediente);

        const ingredientes = await Ingrediente.findAll({
            where: {
                id_ingrediente: { [Op.in]: idsIng }
            },
            attributes: ['id_ingrediente', 'nombre'] // Incluye id_ingrediente para la comparación
        });

        const ingredientesConCantidad = idsIngrediente.map(item => {
            const ingredienteEncontrado = ingredientes.find(ingrediente => ingrediente.id_ingrediente === item.id_ingrediente);
            return {
                nombre: ingredienteEncontrado ? ingredienteEncontrado.nombre : null, // Nombre del ingrediente
                cantidad: item.cantidad // Cantidad del ingrediente
            };
        }).filter(item => item.nombre);


        if (!usuario) {
            ctx.status = 404;
            ctx.body = { error: 'Usuario no encontrado' };
            return;
        }

        const recetaConUsuario = {
            ...receta.toJSON(),
            nombre_usuario: usuario.nombre,
            categorias: categorias.map(categoria => categoria.nombre),
            ingredientes: ingredientesConCantidad // Aquí envías la lista con nombres y cantidades
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
    const { puntuacion } = ctx.request.body;
    const id_receta = ctx.params.id;
    const id_usuario = ctx.state.user.id_usuario;

    try {
        if (puntuacion < 1 || puntuacion > 5) {
            ctx.status = 400;
            ctx.body = { error: 'La puntuación debe estar entre 1 y 5.' };
            return;
        }

        // Verificar si el usuario ya calificó esta receta
        const calificacionExistente = await Calificacion.findOne({
            where: { id_receta, id_usuario }
        });

        if (calificacionExistente) {
            // Actualizar la calificación existente
            await Calificacion.update({ puntuacion }, {
                where: { id_receta, id_usuario }
            });
            ctx.status = 200;
            ctx.body = { message: 'Calificación actualizada exitosamente' };
        } else {
            // Crear una nueva calificación
            const nuevaCalificacion = await Calificacion.create({
                id_receta,
                id_usuario,
                puntuacion
            });
            ctx.status = 201;
            ctx.body = { message: 'Calificación creada exitosamente', id_calificacion: nuevaCalificacion.id_calificacion };
        }
    } catch (error) {
        console.error('Error al calificar la receta:', error);
        ctx.status = 500;
        ctx.body = { error: 'Error al calificar la receta.' };
    }
};

const obtenerCalificacion = async (ctx) => {
    const id_receta = ctx.params.id;
    const id_usuario = ctx.state.user.id_usuario;

    try {
        // Buscar si el usuario ya ha calificado esta receta
        const calificacion = await Calificacion.findOne({
            where: {
                id_receta,
                id_usuario
            },
            attributes: ['puntuacion']
        });

        if (calificacion) {
            ctx.status = 200;
            ctx.body = { puntuacion: calificacion.puntuacion };
        } else {
            ctx.status = 404;
            ctx.body = { message: 'No has calificado esta receta aún.' };
        }
    } catch (error) {
        console.error('Error al obtener la calificación:', error);
        ctx.status = 500;
        ctx.body = { error: 'Error al obtener la calificación.' };
    }
};

const obtenerPromedioCalificacion = async (ctx) => {
    const id_receta = ctx.params.id;

    try {
        // Obtener todas las calificaciones de la receta
        const calificaciones = await Calificacion.findAll({
            where: { id_receta },
            attributes: ['puntuacion']
        });

        // Calcular el promedio
        const totalCalificaciones = calificaciones.length;
        const suma = calificaciones.reduce((acc, curr) => acc + curr.puntuacion, 0);
        const promedio = totalCalificaciones > 0 ? (suma / totalCalificaciones).toFixed(1) : 0;

        ctx.status = 200;
        ctx.body = { promedio };
    } catch (error) {
        console.error('Error al obtener el promedio de calificaciones:', error);
        ctx.status = 500;
        ctx.body = { error: 'Error al obtener el promedio de calificaciones.' };
    }
};

async function categoriaSimilar(idReceta) {
    // Convertir idReceta a Number para asegurar la comparación correcta
    const idRecetaNumber = Number(idReceta);

    // Obtener las categorías de la receta específica
    const categoriasReceta = await RecetaCategoria.findAll({
        where: {
            id_receta: idRecetaNumber
        },
        attributes: ['id_categoria']
    });

    const setCategoriasReceta = new Set(categoriasReceta.map(c => c.id_categoria));

    // Obtener las categorías de todas las recetas
    const todasLasRecetas = await RecetaCategoria.findAll({
        attributes: ['id_receta', 'id_categoria']
    });

    // Crear un diccionario para almacenar las categorías de cada receta
    const mapaRecetas = new Map();

    todasLasRecetas.forEach((receta) => {
        if (!mapaRecetas.has(receta.id_receta)) {
            mapaRecetas.set(receta.id_receta, new Set());
        }
        mapaRecetas.get(receta.id_receta).add(receta.id_categoria);
    });

    // Calcular el coeficiente de Jaccard para cada receta
    const similitudes = [];

    mapaRecetas.forEach((categorias, id) => {
        // Asegúrate de comparar con el tipo correcto
        if (Number(id) !== idRecetaNumber) {
            const interseccion = new Set([...categorias].filter(x => setCategoriasReceta.has(x)));
            const union = new Set([...categorias, ...setCategoriasReceta]);
            const jaccard = interseccion.size / union.size;

            similitudes.push({ id_receta: id, similitud: jaccard });
        }
    });

    // Ordenar las recetas por similitud en orden descendente
    similitudes.sort((a, b) => b.similitud - a.similitud);

    // Retornar las 20 más similares
    return similitudes.slice(0, 20);
}


async function calcularSimilitudIngredientes(idReceta, recetasFiltradas) {
    const ingredientesRecetaBase = await RecetaIngrediente.findAll({
        where: { id_receta: idReceta },
        attributes: ['id_ingrediente']
    });

    const setIngredientesBase = new Set(ingredientesRecetaBase.map(i => i.id_ingrediente));
    const similitudesIngredientes = [];

    for (const receta of recetasFiltradas) {
        if (receta.id_receta !== idReceta) {
        const ingredientesReceta = await RecetaIngrediente.findAll({
            where: { id_receta: receta.id_receta },
            attributes: ['id_ingrediente']
        });

        const setIngredientes = new Set(ingredientesReceta.map(i => i.id_ingrediente));
        const interseccion = new Set([...setIngredientes].filter(i => setIngredientesBase.has(i)));
        const union = new Set([...setIngredientesBase, ...setIngredientes]);
        const jaccard = interseccion.size / union.size;

        similitudesIngredientes.push({ id_receta: receta.id_receta, similitud: jaccard });
    }
    }

    // Ordenar y devolver las 5 recetas más similares por ingredientes
    similitudesIngredientes.sort((a, b) => b.similitud - a.similitud);
    return similitudesIngredientes.filter(receta => receta.id_receta !== idReceta).slice(0, 5);
}

// Controlador principal para obtener recetas similares
const obtenerSimilares = async (ctx) => {

    try {
        const idReceta = ctx.params.id;
        const topSimilaresPorCategoria = await categoriaSimilar(idReceta);
        console.log(topSimilaresPorCategoria);
        const topSimilaresPorIngredientes = await calcularSimilitudIngredientes(idReceta, topSimilaresPorCategoria);

        const similaresIds = topSimilaresPorIngredientes.map(receta => receta.id_receta);

        console.log(topSimilaresPorIngredientes.map(receta => receta.id_receta + receta.similitud));

        const recetasSimilares = await Receta.findAll({
            where: {
                id_receta: similaresIds
            }
        });

        const recetasSimilaresOrdenadas = similaresIds.map(id => 
            recetasSimilares.find(receta => receta.id_receta === id)
        );

        ctx.body = recetasSimilaresOrdenadas;

    } catch (error) {
        console.error("Error en obtenerSimilares:", error);
        ctx.status = 500;
        ctx.body = { error: "Error interno en el servidor" };
    }

};

// Obtiene las recetas de un usuario
const obtenerRecetas = async (ctx) => {

    try {
        const idUsuario = ctx.params.id;
        const recetas = await Receta.findAll({
            where: {
                id_usuario: idUsuario
            }
        });

        ctx.body = recetas;

    } catch (error) {
        console.error("Error en obtenerSimilares:", error);
        ctx.status = 500;
        ctx.body = { error: "Error interno en el servidor" };
    }

};


module.exports = { crearReceta, obtenerReceta, calificarReceta, obtenerCalificacion, obtenerPromedioCalificacion, obtenerSimilares, obtenerRecetas };
