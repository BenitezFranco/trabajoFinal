const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const Usuario = require('./Usuario');
const Receta = require('./Receta');

const Favorito = sequelize.define('Favorito', {
    id_favorito: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    }
}, {
    tableName: 'Favorito',
    timestamps: false,
});

Favorito.belongsTo(Usuario, { foreignKey: 'id_usuario' });
Favorito.belongsTo(Receta, { foreignKey: 'id_receta' });

module.exports = Favorito;
