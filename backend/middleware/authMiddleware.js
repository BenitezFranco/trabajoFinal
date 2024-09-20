const jwt = require('jsonwebtoken');
const JWT_SECRET = 'tu_clave_secreta';

const authenticate = async (ctx, next) => {
    const authHeader = ctx.headers.authorization;
    console.log('Auth Header:', authHeader); // Agrega este log para depurar
    if (!authHeader) {
        ctx.status = 401;
        ctx.body = { error: 'No token provided' };
        return;
    }

    const token = authHeader.split(' ')[1]; // El formato debe ser "Bearer <token>"
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        ctx.state.user = decoded; // Coloca el ID del usuario en el estado
        console.log('Decoded:', decoded);
        await next();
    } catch (error) {
        ctx.status = 403;
        ctx.body = { error: 'Invalid token' };
    }
};

module.exports = authenticate;
