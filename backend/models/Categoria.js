const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Categoria = sequelize.define('Categoria', {
    id_categoria: {
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
    tableName: 'Categoria',
    timestamps: false,
});

module.exports = Categoria;
