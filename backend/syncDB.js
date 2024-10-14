const sequelize = require('./config/dbConfig'); // Importa la conexión a la base de datos

const CalendarioSemanal_Receta=require('./models/CalendarioSemanal_Receta');
const CalendarioSemanal =require('./models/CalendarioSemanal');
const Calificacion=require('./models/Calificacion');
const Categoria=require('./models/Categoria');
const Comentario=require('./models/Comentario');
const Favorito=require('./models/Favorito');
const Receta_Categoria=require('./models/Receta_Categoria');
const Receta= require('./models/Receta');
const Seguimiento=require('./models/Seguimiento');
const Usuario=require('./models/Usuario');

// Función para sincronizar la base de datos
const syncDatabase = () => {
    sequelize.sync({ alter: true }) // Puedes usar force: true si lo prefieres
        .then(() => {
            console.log('Base de datos sincronizada correctamente.');
        })
        .catch((error) => {
            console.error('Error al sincronizar la base de datos:', error);
        });
};

module.exports = syncDatabase;