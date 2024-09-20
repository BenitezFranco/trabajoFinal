const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const Usuario = require('./Usuario');
const Categoria = require('./Categoria');

const Receta = sequelize.define('Receta', {
    id_receta: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    titulo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.TEXT,
    },
    instrucciones: {
        type: DataTypes.TEXT,
    },
    ingredientes: {
        type: DataTypes.TEXT,
    },
    dificultad: {
        type: DataTypes.ENUM('Fácil', 'Media', 'Difícil'),
        allowNull: false,
    },
    tiempo_preparacion: {
        type: DataTypes.INTEGER,
    },
    fecha_publicacion: {
        type: DataTypes.DATE,
    }
}, {
    tableName: 'Receta',
    timestamps: false,
});

Receta.belongsTo(Usuario, { foreignKey: 'id_usuario' });
Receta.belongsTo(Categoria, { foreignKey: 'id_categoria' });

module.exports = Receta;
