const Receta = require('../models/Receta');
const Receta_Categoria = require('../models/Receta_Categoria');
const { Op, Sequelize } = require('sequelize');

const buscarRecetasSemanal = async (ctx) => {
    const { tipo_busqueda, cantidad, primera, segunda, tercera } = ctx.query;

    const diasSemana = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];

    const primeraFiltro = Array.isArray(primera) ? primera : [primera].filter(Boolean);

    const segundaFiltro = Array.isArray(segunda) ? segunda : [segunda].filter(Boolean);

    const terceraFiltro = Array.isArray(tercera) ? tercera : [tercera].filter(Boolean);

    const categoriasFiltro= [primeraFiltro,segundaFiltro,terceraFiltro];

    let recetasPorDia = {
        'lunes': [], 'martes': [], 'miércoles': [], 
        'jueves': [], 'viernes': [], 'sábado': [], 'domingo': []
    };

    try {
        let recetasCategoria;
        for (let i=0;i<cantidad;i++){
            if(tipo_busqueda==='filtrado'){
                recetasCategoria = await Receta_Categoria.findAll({
                    where: {
                        id_categoria: { [Op.in]: categoriasFiltro[i] },
                    }});
            }else{
                recetasCategoria = await Receta_Categoria.findAll();
            }

            let recetas = recetasCategoria.map((r) => r.id_receta);

            while (recetas.length < 7) { recetas.push(...recetas.slice(0, 7 - recetas.length)); }

            for (let dia of diasSemana) { const recetaAleatoria = recetas.splice(Math.floor(Math.random() * recetas.length), 1)[0]; const receta = await Receta.findOne({ where: { id_receta: recetaAleatoria } }); recetasPorDia[dia].push(receta); }
        }

        ctx.body = recetasPorDia;

    } catch (error) {
        console.error("Error: ", error);
        ctx.status = 500;
        ctx.body = { error: 'Error al obtener las recetas' };
    }
};


module.exports = { buscarRecetasSemanal };
