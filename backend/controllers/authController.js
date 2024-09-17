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
        
        const token = jwt.sign({ id_usuario: usuario.id_usuario }, JWT_SECRET, { expiresIn: '1h' });
        ctx.status = 200;
        ctx.body = { token };
    } catch (error) {
        ctx.status = 500;
        ctx.body = { error: 'Error al iniciar sesión' };
    }
};
