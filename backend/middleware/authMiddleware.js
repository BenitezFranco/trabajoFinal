const jwt = require('jsonwebtoken');
const JWT_SECRET = 'tu_clave_secreta';

const authenticate = async (ctx, next) => {
    const authHeader = ctx.headers.authorization;

    if (!authHeader) {
        ctx.status = 401;
        ctx.body = { error: 'No token provided' };
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET, { ignoreExpiration: true });

        const currentTime = Math.floor(Date.now() / 1000);

        if (decoded.exp < currentTime) {
            ctx.status = 401;
            ctx.body = { error: 'Token has expired' };
            return; 
        }
        if (decoded.exp - currentTime < 600) { 
            const newToken = jwt.sign({ userId: decoded.userId }, JWT_SECRET, { expiresIn: '7d' });

            ctx.set('Authorization', `Bearer ${newToken}`);

            ctx.status = 200;
            ctx.body = { message: 'Token renewed successfully', newToken };
            return; 
        }

        ctx.state.user = decoded;
        await next();
    } catch (error) {
        ctx.status = 403;
        ctx.body = { error: 'Invalid token' };
    }
};

module.exports = authenticate;



module.exports = authenticate;

