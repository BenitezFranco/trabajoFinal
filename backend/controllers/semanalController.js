const CalendarioSemanal = require ('../models/CalendarioSemanal');
const CalendarioSemanalReceta= require('../models/CalendarioSemanal_Receta');

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

const obtenerCalendario = async(ctx)=>{
    const usuario = ctx.state.user.id_usuario;
    const calendarios= await CalendarioSemanal.findAll({
        where: {
            id_usuario: usuario,
            completado:false},
            order:id_calendario
        });
    if (!calendarios) {
        ctx.status = 404;
        ctx.body = { error: 'Calendarios no encontrados' };
        return;
    }


}

module.exports = { crearCalendario };

