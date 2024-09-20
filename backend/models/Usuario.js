const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/dbConfig');

const Usuario = sequelize.define('Usuario', {
    id_usuario: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    correo_electronico: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    contrasena: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    foto_perfil: {
        type: DataTypes.STRING,
    }
}, {
    tableName: 'Usuario',
    timestamps: false,
    hooks: {
        beforeCreate: async (usuario) => {
            // Encriptar contraseña antes de guardar el usuario
            const salt = await bcrypt.genSalt(10);
            usuario.contrasena = await bcrypt.hash(usuario.contrasena, salt);
        }
    }
});
Usuario.prototype.validarContraseña = async function (contraseña) {
    return bcrypt.compare(contraseña, this.contrasena);
};

module.exports = Usuario;
