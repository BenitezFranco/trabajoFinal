const Router = require('koa-router');
const authController = require('../controllers/authController');
const authenticate = require('../middleware/authMiddleware');
const Usuario = require('../models/Usuario');
const { crearReceta } = require('../controllers/recetaController');

const router = new Router();

// Rutas de autenticación
router.post('/register', authController.register);
router.post('/login', authController.login);

// Ruta protegida para obtener el perfil del usuario
router.get('/perfil', authenticate, async (ctx) => {
    try {
        const usuarioId = ctx.state.user.id_usuario;
        console.log('Usuario ID:', usuarioId);
        const usuario = await Usuario.findByPk(usuarioId, {
            attributes: ['id_usuario', 'nombre', 'correo_electronico', 'foto_perfil']
        });

        if (usuario) {
            ctx.body = usuario;
        } else {
            ctx.status = 404;
            ctx.body = { error: 'Usuario no encontrado' };
        }
    } catch (error) {
        ctx.status = 500;
        ctx.body = { error: 'Error al obtener los datos del perfil' };
    }
});

// Ruta para crear recetas (protegida por el middleware de autenticación)
router.post('/create-recipe', authenticate, crearReceta);


module.exports = router;
