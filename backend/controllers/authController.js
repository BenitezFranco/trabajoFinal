//authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

// Clave secreta para JWT
const JWT_SECRET = 'tu_clave_secreta';

exports.register = async (ctx) => {
    const { nombre, correo_electronico, contrasena } = ctx.request.body;
    
    try {
        const usuario = await Usuario.create({ nombre, correo_electronico, contrasena });
        ctx.status = 201;
        ctx.body = { id_usuario: usuario.id_usuario, nombre: usuario.nombre, correo_electronico: usuario.correo_electronico };
    } catch (error) {
        ctx.status = 500;
        ctx.body = { error: 'Error al registrar el usuario' };
    }
};

exports.login = async (ctx) => {
    const { correo_electronico, contrasena } = ctx.request.body;
    
    try {
        const usuario = await Usuario.findOne({ where: { correo_electronico } });
        if (!usuario || !(await bcrypt.compare(contrasena, usuario.contrasena))) {
            ctx.status = 401;
            ctx.body = { error: 'Correo electrónico o contraseña incorrectos' };
            return;
        }
        
        const token = jwt.sign({ id_usuario: usuario.id_usuario }, JWT_SECRET, { expiresIn: '7d' });
        ctx.status = 200;
        ctx.body = { token };
    } catch (error) {
        ctx.status = 500;
        ctx.body = { error: 'Error al iniciar sesión' };
    }

    const obtenerPerfil = async (ctx) => {
        const userId = ctx.state.user.id; // Asumiendo que el ID del usuario está en el estado después de la autenticación
    
        try {
            const usuario = await Usuario.findOne({
                where: { id: userId },
                attributes: ['id_usuario', 'nombre', 'correo_electronico'], // Ajusta los atributos según tus necesidades
            });
    
            if (!usuario) {
                ctx.status = 404;
                ctx.body = { message: 'Usuario no encontrado' };
                return;
            }
    
            ctx.status = 200;
            ctx.body = usuario; // Envia el objeto del usuario como respuesta
        } catch (error) {
            ctx.status = 500;
            ctx.body = { message: 'Error al obtener el perfil del usuario' };
            console.error('Error al obtener el perfil:', error);
        }
    };
    
    module.exports = {
        obtenerPerfil,
    };
};

