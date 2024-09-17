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

Seguimiento.belongsTo(Usuario, { foreignKey: 'id_usuario_seguidor' });
Seguimiento.belongsTo(Usuario, { foreignKey: 'id_usuario_seguido' });

module.exports = Seguimiento;
