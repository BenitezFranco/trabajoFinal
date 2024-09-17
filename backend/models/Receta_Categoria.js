const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const Receta = require('./Receta');
const Categoria = require('./Categoria');

const Receta_Categoria = sequelize.define('Receta_Categoria', {
    id_receta: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    id_categoria: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    }
}, {
    tableName: 'Receta_Categoria',
    timestamps: false,
});

Receta_Categoria.belongsTo(Receta, { foreignKey: 'id_receta' });
Receta_Categoria.belongsTo(Categoria, { foreignKey: 'id_categoria' });

module.exports = Receta_Categoria;
