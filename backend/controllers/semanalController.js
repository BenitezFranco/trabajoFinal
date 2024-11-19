const CalendarioSemanal = require ('../models/CalendarioSemanal');
const CalendarioSemanalReceta= require('../models/CalendarioSemanal_Receta');
const Receta = require('../models/Receta');

const crearCalendario = async (ctx) => {

    const idsRecetas = ctx.request.body.idsRecetas;
    const id_usuario = ctx.state.user.id_usuario;
    try {
        const nuevoCalendario = await CalendarioSemanal.create({id_usuario: id_usuario});
        
        idsRecetas.map( async (id)=> await CalendarioSemanalReceta.create({
            id_calendario: nuevoCalendario.id_calendario,
            id_receta:id
        }))
        
        ctx.body = { message: 'Calendario creado exitosamente' };
    } catch (error) {
        console.error("Error al crear el calendario:", error);
    }
};

const obtenerCalendario = async (ctx) => {
    const usuario = ctx.state.user.id_usuario;

    try {
        // Obtener los calendarios semanales asociados al usuario
        const calendarios = await CalendarioSemanal.findAll({
            where: {
                id_usuario: usuario
            },
            order: [['id_calendario', 'ASC']],
        });

        if (!calendarios || calendarios.length === 0) {
            ctx.status = 200;
            ctx.body = [];
            return;
        }

        const idCalendarios = calendarios.map(calendario => calendario.dataValues.id_calendario);

        // Obtener las relaciones calendario-receta
        const calReceta = await CalendarioSemanalReceta.findAll({
            where: { id_calendario: idCalendarios },
            order: [['id_rel_cal_rec', 'ASC']],
            attributes: ['id_calendario', 'id_receta']
        });

        const idRecetas = calReceta.map(relacion => relacion.dataValues.id_receta);

        // Obtener las recetas por sus IDs
        const recetas = await Receta.findAll({
            where: { id_receta: idRecetas }
        });

        // Organizar las recetas por id_calendario
        const recetasPorCalendario = idCalendarios.map(idCal => ({
            id_calendario: idCal,
            recetas: calReceta
                .filter(rel => rel.id_calendario === idCal)
                .map(rel => recetas.find(receta => receta.id_receta === rel.id_receta))
        }));

        ctx.status = 200;
        ctx.body = recetasPorCalendario;

    } catch (error) {
        console.error(error);
        ctx.status = 500;
        ctx.body = { error: 'Error al obtener los calendarios' };
    }
};

const borrarCalendario = async (ctx) => {
    const id_calendario = ctx.params.id;

    try {
        const result = await CalendarioSemanalReceta.destroy({ where: { id_calendario } });
        if (!result) {
            ctx.status = 404;
            ctx.body = { error: 'Calendario no encontrado' };
            return;
        }
        const response =await CalendarioSemanal.destroy({ where: { id_calendario } });
        if (!response) {
            ctx.status = 404;
            ctx.body = { error: 'Calendario no encontrado' };
            return;
        }
        ctx.status = 200;
        ctx.body = { message: 'Calendario eliminado correctamente' };
    } catch (error) {
        ctx.status = 500;
        ctx.body = { error: 'Error al eliminar el calendario' };
    }
};

module.exports = { crearCalendario, obtenerCalendario, borrarCalendario };

