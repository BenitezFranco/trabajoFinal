const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const Usuario = require('./Usuario');

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
        type: DataTypes.JSON,
        allowNull: false,
    },
    ingredientes: {
        type: DataTypes.JSON,
        allowNull: false,
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

module.exports = Receta;
