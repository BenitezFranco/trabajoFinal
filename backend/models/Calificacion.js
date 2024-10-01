const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const Usuario = require('./Usuario');
const Receta = require('./Receta');

const Calificacion = sequelize.define('Calificacion', {
    id_calificacion: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    id_usuario: {
        type: DataTypes.INTEGER, // Asegúrate de que este tipo coincida con el modelo Usuario
        allowNull: false,
    },
    id_receta: {
        type: DataTypes.INTEGER, // Asegúrate de que este tipo coincida con el modelo Receta
        allowNull: false,
    },
    puntuacion: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: {
            min: 1,
            max: 5,
        },
    }
}, {
    tableName: 'Calificacion',
    timestamps: false,
});

// Definir relaciones
Calificacion.belongsTo(Usuario, { foreignKey: 'id_usuario' });
Calificacion.belongsTo(Receta, { foreignKey: 'id_receta' });

module.exports = Calificacion;
