const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const Usuario = require('./Usuario');

const Seguimiento = sequelize.define('Seguimiento', {
    id_seguimiento: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    }
}, {
    tableName: 'Seguimiento',
    timestamps: false,
});

// Relación con Usuario como Seguidor
Seguimiento.belongsTo(Usuario, { foreignKey: 'id_usuario_seguidor', as: 'seguidor' });

// Relación con Usuario como Seguido
Seguimiento.belongsTo(Usuario, { foreignKey: 'id_usuario_seguido', as: 'seguido' });

module.exports = Seguimiento;
