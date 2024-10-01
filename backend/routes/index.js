const Router = require('koa-router');
const authController = require('../controllers/authController');
const authenticate = require('../middleware/authMiddleware');
const { crearReceta, obtenerReceta, calificarReceta } = require('../controllers/recetaController');
const { buscarRecetasYUsuarios } = require('../controllers/searchController');
const { seguirUsuario, obtenerSeguimientos } = require('../controllers/seguimientoController'); // Importar las funciones del controlador
const Usuario = require('../models/Usuario');

const router = new Router();

// Rutas de autenticación
router.post('/register', authController.register);
router.post('/login', authController.login);

// Ruta protegida para obtener el perfil del usuario
router.get('/perfil', authenticate, async (ctx) => {
    const usuarioId = ctx.state.user.id_usuario;
    const usuario = await Usuario.findByPk(usuarioId, {
        attributes: ['id_usuario', 'nombre', 'correo_electronico', 'foto_perfil']
    });

    if (usuario) {
        ctx.body = usuario;
    } else {
        ctx.status = 404;
        ctx.body = { error: 'Usuario no encontrado' };
    }
});

// Crear receta (protegida)
router.post('/create-recipe', authenticate, crearReceta);

// Obtener receta por ID (protegida)
router.get('/receta/:id', authenticate, obtenerReceta);

// Calificar receta (protegida)
router.post('/receta/:id/calificar', authenticate, calificarReceta);

// Buscador
router.get('/search', buscarRecetasYUsuarios);

// Ruta para seguir a un usuario (protegida)
router.post('/follow', authenticate, seguirUsuario);

// Ruta para obtener la lista de usuarios seguidos (protegida)
router.get('/seguimientos', authenticate, obtenerSeguimientos);

module.exports = router;
