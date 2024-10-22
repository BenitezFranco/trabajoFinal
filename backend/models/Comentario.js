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
    },
    id_comentario_padre: {
        type: DataTypes.INTEGER,
        allowNull: true, // Este campo es opcional y permite respuestas a otros comentarios
    }
}, {
    tableName: 'Comentario',
    timestamps: false,
});

// Relaciones
Comentario.belongsTo(Usuario, { foreignKey: 'id_usuario' });
Comentario.belongsTo(Receta, { foreignKey: 'id_receta' });

// Asociación para comentarios anidados
Comentario.belongsTo(Comentario, { as: 'ComentarioPadre', foreignKey: 'id_comentario_padre' });
Comentario.hasMany(Comentario, { as: 'Respuestas', foreignKey: 'id_comentario_padre' });

module.exports = Comentario;
