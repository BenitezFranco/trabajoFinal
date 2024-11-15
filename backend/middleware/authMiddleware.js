//authMiddleware.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'tu_clave_secreta';

const authenticate = async (ctx, next) => {
    const authHeader = ctx.headers.authorization;

    if (!authHeader) {
        ctx.status = 401;
        ctx.body = { error: 'No token provided' };
        return;
    }

    const token = authHeader.split(' ')[1]; // El formato debe ser "Bearer <token>"

    try {
        // Decodificamos el token sin verificar la expiración aún
        const decoded = jwt.verify(token, JWT_SECRET, { ignoreExpiration: true });

        const currentTime = Math.floor(Date.now() / 1000);

        // Verificamos si el token ya expiró
        if (decoded.exp < currentTime) {
            // Si expiró, devolvemos un mensaje de error
            ctx.status = 401; // O 403, dependiendo de la semántica que quieras
            ctx.body = { error: 'Token has expired' };
            return; // Terminamos el proceso aquí
        }

        // Si el token no ha expirado, verificamos si necesitamos renovarlo
        // En este caso, solo renovamos si el token va a expirar en menos de 10 minutos
        if (decoded.exp - currentTime < 600) { // 600 segundos = 10 minutos
            const newToken = jwt.sign({ userId: decoded.userId }, JWT_SECRET, { expiresIn: '10h' });

            // Colocamos el nuevo token en la cabecera de la respuesta
            ctx.set('Authorization', `Bearer ${newToken}`);

            // Enviamos una respuesta que indique que el token se renovó correctamente
            ctx.status = 200;
            ctx.body = { message: 'Token renewed successfully', newToken };
            return; // Terminamos aquí, ya no necesitamos pasar al siguiente middleware
        }

        // Si el token es válido y no requiere renovación, lo pasamos al siguiente middleware
        ctx.state.user = decoded;
        await next();
    } catch (error) {
        // Si el token es inválido o no existe, respondemos con un error
        ctx.status = 403;
        ctx.body = { error: 'Invalid token' };
    }
};

module.exports = authenticate;



module.exports = authenticate;

