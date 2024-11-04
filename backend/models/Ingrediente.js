const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Ingrediente = sequelize.define('Ingrediente', {
    id_ingrediente: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    }
}, {
    tableName: 'Ingrediente',
    timestamps: false,
});

module.exports = Ingrediente;
