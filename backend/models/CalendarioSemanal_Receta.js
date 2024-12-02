const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const CalendarioSemanal = require('./CalendarioSemanal');
const Receta = require('./Receta');

const CalendarioSemanal_Receta = sequelize.define('CalendarioSemanal_Receta', {
    id_rel_cal_rec: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    id_calendario: {
        type: DataTypes.INTEGER,
    },
    id_receta: {
        type: DataTypes.INTEGER,
    },
    completado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'CalendarioSemanal_Receta',
    timestamps: false,
});

CalendarioSemanal_Receta.belongsTo(CalendarioSemanal, { foreignKey: 'id_calendario' });
CalendarioSemanal_Receta.belongsTo(Receta, { foreignKey: 'id_receta' });

module.exports = CalendarioSemanal_Receta;
