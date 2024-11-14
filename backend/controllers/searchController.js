const Usuario = require('../models/Usuario'); 
const Receta = require('../models/Receta');
const Receta_Categoria = require('../models/Receta_Categoria');
const Categoria = require('../models/Categoria');
const { Op, Sequelize } = require('sequelize');
const Receta_Ingrediente= require('../models/Receta_Ingrediente');

const buscarRecetasYUsuarios = async (ctx) => {
    const { titulo, ingredientes, dificultad, creador, usuario, id_categoria } = ctx.query;
    let results = [];

    // Asegúrate de que id_categoria sea un arreglo
    const categoriasRepetidas = Array.isArray(id_categoria) ? id_categoria : [id_categoria].filter(Boolean);

    //Con set quito los repetidos
    const categorias = [...new Set(categoriasRepetidas)];

    // Asegúrate de que dificultad sea un arreglo
    const dificultades = Array.isArray(dificultad) ? dificultad : [dificultad].filter(Boolean);

    // Asegúrate de que titulo sea un arreglo
    const titulos = Array.isArray(titulo) ? titulo : [titulo].filter(Boolean);

    

    try {
        if (usuario) {
            // Buscar solo usuarios
            results = await Usuario.findAll({ 
                where: { nombre: { [Op.like]: `%${usuario}%` } } 
            });
        } else {
            // Si no hay usuario, verificar si hay id_categoria
            const recetaFilter = {}; // Crear el objeto de filtros de recetas

            if (categorias.length > 0) {
                // Si hay id_categoria, buscar los id_receta correspondientes
                const recetasConCategoria = await Receta_Categoria.findAll({
                    where: { id_categoria: { [Op.in]: categorias } },
                    attributes: ['id_receta'],
                    group: ['id_receta'],
                    having: Sequelize.literal(`COUNT(id_categoria) = ${categorias.length}`)
                });

                const idsRecetas = recetasConCategoria.map(receta => receta.id_receta);

                // Configurar el filtro de id_receta en recetaFilter
                recetaFilter.id_receta = idsRecetas; // Filtrar por id_receta
            }

            // Aplicar otros filtros
            if (titulos.length > 0) {
                // Usar Op.and para múltiples títulos
                recetaFilter.titulo = {
                    [Op.and]: titulos.map(tituloTerm => ({
                        [Op.like]: `%${tituloTerm}%`
                    }))
                };
            }
            if (dificultades.length > 0) {
                // Filtrar por dificultades, ya sea una lista o un solo valor
                recetaFilter.dificultad = {
                    [Op.in]: dificultades
                };
            }
            const ingredientesRepetidos = Array.isArray(ctx.query.id_ingrediente)
    ? ctx.query.id_ingrediente
    : ctx.query.id_ingrediente ? [ctx.query.id_ingrediente] : [];

            const ingredientes = [...new Set(ingredientesRepetidos)];
            

            if (ingredientes.length > 0) {
                // Si hay id_categoria, buscar los id_receta correspondientes
                const recetasConIngrediente = await Receta_Ingrediente.findAll({
                    where: { id_ingrediente: { [Op.in]: ingredientes } },
                    attributes: ['id_receta'],
                    group: ['id_receta'],
                    having: Sequelize.literal(`COUNT(id_ingrediente) = ${ingredientes.length}`)
                });

                const idsRecetas = recetasConIngrediente.map(receta => receta.id_receta);

                // Configurar el filtro de id_receta en recetaFilter
                recetaFilter.id_receta = idsRecetas; // Filtrar por id_receta
            }

            // Buscar recetas filtrando por los criterios definidos
            results = await Receta.findAll({
                where: recetaFilter,
                include: [
                    creador ? {
                        model: Usuario,
                        where: { nombre: { [Op.like]: `%${creador}%` } }
                    } : undefined
                ].filter(Boolean) // Filtrar valores no definidos
            });
        }

        ctx.body = results;

    } catch (error) {
        ctx.status = 500;
        console.log("Error: ", error);
        ctx.body = { error: 'Error al realizar la búsqueda' };
    }
};

module.exports = { buscarRecetasYUsuarios};
