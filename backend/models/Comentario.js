const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const Usuario = require('./Usuario');
const Receta = require('./Receta');

const Comentario = sequelize.define('Comentario', {
    id_comentario: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    texto: {
        type: DataTypes.TEXT,
        allowNull: false,
    }
}, {
    tableName: 'Comentario',
    timestamps: false,
});

Comentario.belongsTo(Usuario, { foreignKey: 'id_usuario' });
Comentario.belongsTo(Receta, { foreignKey: 'id_receta' });

module.exports = Comentario;
