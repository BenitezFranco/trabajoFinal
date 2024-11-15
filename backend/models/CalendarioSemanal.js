const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const Usuario = require('./Usuario');

const CalendarioSemanal = sequelize.define('CalendarioSemanal', {
    id_calendario: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    completado:{
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    pareja: {
        type: DataTypes.INTEGER,
    }
}, {
    tableName: 'CalendarioSemanal',
    timestamps: false,
});

CalendarioSemanal.belongsTo(Usuario, { foreignKey: 'id_usuario' });

module.exports = CalendarioSemanal;
