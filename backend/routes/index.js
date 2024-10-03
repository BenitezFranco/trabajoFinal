//routes/index.js
const Router = require('koa-router');
const authController = require('../controllers/authController');
const authenticate = require('../middleware/authMiddleware');
const { crearReceta, obtenerReceta, calificarReceta } = require('../controllers/recetaController');
const { buscarRecetasYUsuarios } = require('../controllers/searchController');
const { seguirUsuario, obtenerSeguimientos, dejarDeSeguirUsuario, obtenerPerfil } = require('../controllers/seguimientoController');
const { agregarFavorito, eliminarFavorito, obtenerFavoritos, estaEnFavoritos} = require('../controllers/favoritoController'); // Controlador de favoritos
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

// Buscador de recetas y usuarios
router.get('/search', buscarRecetasYUsuarios);

// Ruta para seguir a un usuario (protegida)
router.post('/follow', authenticate, seguirUsuario);

// Ruta para obtener la lista de usuarios seguidos (protegida)
router.get('/seguimientos', authenticate, obtenerSeguimientos);

// Ruta para dejar de seguir a un usuario (protegida)
router.post('/unfollow', authenticate, dejarDeSeguirUsuario);

// Ruta para agregar una receta a favoritos (protegida)
router.post('/receta/:id/favorito', authenticate, agregarFavorito);

// Ruta para eliminar una receta de favoritos (protegida)
router.delete('/receta/:id/favorito', authenticate, eliminarFavorito);

// Ruta para obtener las recetas favoritas de un usuario (protegida)
router.get('/favoritos', authenticate, obtenerFavoritos);

// Verificar si una receta está en favoritos (protegida)
router.get('/receta/:id/favorito/estado', authenticate, estaEnFavoritos);

router.get('/perfil/:id', authenticate, obtenerPerfil);

module.exports = router;

