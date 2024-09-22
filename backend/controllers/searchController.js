const Usuario = require('../models/Usuario'); // Asume que tienes estos modelos definidos
const Receta  = require('../models/Receta');
const { Op } = require('sequelize');


const buscarRecetasYUsuarios = async (ctx) => {
    const { filter, term } = ctx.query;

    let results = [];
    console.log("filter: ",filter);
    console.log("term: ",term);
    try {
        if (filter === 'titulo') {
            results = await Receta.findAll({ where: { titulo: { [Op.like]: `%${term}%` } } });
            console.log("Results: ",results)
        } else if (filter === 'ingredientes') {
            results = await Receta.findAll({ where: { ingredientes: { [Op.like]: `%${term}%` } } });
        } else if (filter === 'dificultad') {
            results = await Receta.findAll({ where: { dificultad: { [Op.like]: `%${term}%` } } });
        } else if (filter === 'creador') {
            results = await Receta.findAll({
                include: {
                    model: Usuario,
                    where: { nombre: { [Op.like]: `%${term}%` } }
                }
            });
        } else if (filter === 'usuario') {
            results = await Usuario.findAll({ where: { nombre: { [Op.like]: `%${term}%` } } });
        }

        ctx.body = results;
    } catch (error) {
        ctx.status = 500;
        console.log("Error: ",error);
        ctx.body = { error: 'Error al realizar la búsqueda' };
    }
};

module.exports = { buscarRecetasYUsuarios };
