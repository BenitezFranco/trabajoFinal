const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const Receta = require('./Receta');
const Ingrediente = require('./Ingrediente');

const Receta_Ingrediente = sequelize.define('Receta_Ingrediente', {
    id_receta: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    id_ingrediente: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    cantidad: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    tableName: 'Receta_Ingrediente',
    timestamps: false,
});

Receta_Ingrediente.belongsTo(Receta, { foreignKey: 'id_receta' });
Receta_Ingrediente.belongsTo(Ingrediente, { foreignKey: 'id_ingrediente' });

module.exports = Receta_Ingrediente;
