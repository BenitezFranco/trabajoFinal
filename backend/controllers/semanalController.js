/***const Receta = require('../models/Receta');
const Receta_Categoria = require('../models/Receta_Categoria');
const { Op, Sequelize } = require('sequelize');

const buscarRecetasSemanal = async (ctx) => {
    console.log("ctx.query: ", ctx.query);
    const { tipo_busqueda, id_categoria } = ctx.query; // `tipo_busqueda` puede ser 'aleatorio' o 'filtrado'

    // Definir las categorías: desayuno (3), almuerzo (9), cena (8)
    const categorias = [3, 9, 8]; 
    const diasSemana = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo']; // Los días de la semana
    let recetas;

    // Asegúrate de que id_categoria sea un arreglo
    const categoriasRepetidas = Array.isArray(id_categoria) ? id_categoria : [id_categoria].filter(Boolean);
    // Eliminar duplicados con Set
    const categoriasFiltro = [...new Set(categoriasRepetidas)];

    let recetasPorDia = {'lunes':[], 'martes':[], 'miércoles':[], 'jueves':[], 'viernes':[], 'sábado':[], 'domingo':[]};

    // Objeto para llevar un seguimiento de cuántas veces se ha seleccionado cada receta
    let recetasSeleccionadas = {};

    try {
        if (tipo_busqueda === 'aleatorio') {
        

            // Obtenemos todas las recetas por cada categoría
            for (let categoria of categorias) {
                const recetasCategoria = await Receta_Categoria.findAll({
                    where: { id_categoria: categoria }
                });

                recetas=[];

                // Mapear todas las recetas a un array con su id_receta
                for (let recetaCategoria of recetasCategoria) {
                    recetas= recetas.push(recetaCategoria.id_receta);
                }

                if(recetas.length<7){
                    
                    while (recetas.length < 7) {
                        // Si hay menos de 7 recetas, agregar recetas aleatorias para completar
                        recetas.push(...recetas); 
                    }
                
                    // Ahora recorrer los días de la semana
                    diasSemana.forEach(dia => {
                        // Seleccionar una receta aleatoria
                        const recetaAleatoria = recetas.splice(Math.floor(Math.random() * recetas.length), 1)[0];
                        
                        // Asignar esa receta al día
                        recetasPorDia[dia].push(recetaAleatoria);
                    });
            }

        } else if (tipo_busqueda === 'filtrado') {
            // Obtener recetas filtradas por categoría
            for (let i = 0; i < diasSemana.length; i++) {
                const dia = diasSemana[i];
                recetasPorDia[dia] = [];

                // Buscar recetas de las categorías seleccionadas
                for (let categoria of categorias) {
                    // Usar Op.in para incluir todas las categorías seleccionadas (base + filtro)
                    const recetasFiltradas = await Receta_Categoria.findAll({
                        where: { 
                            id_categoria: { 
                                [Op.in]: [...[categoria], ...categoriasFiltro] // Combina la categoría base con las categorías filtradas
                            }
                        },
                    });

                    // Mapear las recetas filtradas para obtener las recetas completas
                    for (let recetaCategoria of recetasFiltradas) {
                        const receta = await Receta.findByPk(recetaCategoria.id_receta);
                        
                        if (receta) {
                            // Verificar cuántas veces se ha seleccionado esta receta
                            if ((recetasSeleccionadas[receta.id_receta] || 0) < 2) {
                                recetasSeleccionadas[receta.id_receta] = (recetasSeleccionadas[receta.id_receta] || 0) + 1;
                                recetasPorDia[dia].push(receta);
                            }
                        }
                    }
                }
            }
        }

        // Enviar las recetas por día de la semana
        ctx.body = recetasPorDia;

    } catch (error) {
        ctx.status = 500;
        console.log("Error: ", error);
        ctx.body = { error: 'Error al obtener las recetas' };
    }
};

module.exports = { buscarRecetasSemanal };*/
