/**const Router = require('koa-router');
const authController = require('../controllers/authController');
const authenticate = require('../middleware/authMiddleware'); // Asegúrate de tener este middleware
const Usuario = require('../models/Usuario');

const router = new Router();

// Ruta para registro
router.post('/register', authController.register);

// Ruta para login
router.post('/login', authController.login);

// Ruta protegida para obtener el perfil del usuario
router.get('/perfil', authenticate, async (ctx) => {
    try {
        // Obtener el ID del usuario desde el estado (después de que pase la autenticación)
        const usuarioId = ctx.state.user.id;
        
        // Buscar al usuario por ID
        const usuario = await Usuario.findByPk(usuarioId, {
            attributes: ['id_usuario', 'nombre', 'correo_electronico', 'foto_perfil'] // Solo los datos no sensibles
        });

        if (usuario) {
            // Si se encuentra el usuario, enviar la respuesta
            ctx.body = usuario;
        } else {
            // Si no se encuentra, enviar un error 404
            ctx.status = 404;
            ctx.body = { error: 'Usuario no encontrado' };
        }
    } catch (error) {
        // Manejo de errores
        ctx.status = 500;
        ctx.body = { error: 'Error al obtener los datos del perfil' };
    }
});

module.exports = router;
*/