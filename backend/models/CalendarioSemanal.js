const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const Usuario = require('./Usuario');

const CalendarioSemanal = sequelize.define('CalendarioSemanal', {
    id_calendario: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre: {
        type: DataTypes.STRING,
        defaultValue: 'calendario',
        allowNull: false, // Asegúrate de requerir el nombre
    },
}, {
    tableName: 'CalendarioSemanal',
    timestamps: false,
});

CalendarioSemanal.belongsTo(Usuario, { foreignKey: 'id_usuario' });

module.exports = CalendarioSemanal;
