// routes/index.js
const Router = require('koa-router');
const authController = require('../controllers/authController');
const authenticate = require('../middleware/authMiddleware');
const { crearReceta, obtenerReceta, calificarReceta, obtenerCalificacion, obtenerPromedioCalificacion, obtenerSimilares } = require('../controllers/recetaController');
const { buscarRecetasYUsuarios } = require('../controllers/searchController');
const { seguirUsuario, obtenerSeguimientos, dejarDeSeguirUsuario, obtenerPerfil, obtenerSeguidores } = require('../controllers/seguimientoController');
const { agregarFavorito, eliminarFavorito, obtenerFavoritos, estaEnFavoritos } = require('../controllers/favoritoController');
const Usuario = require('../models/Usuario');
const { subirImagen } = require('../controllers/uploadController');
const {editarUsuario, obtenerUsuario}=require('../controllers/usuarioController');
const {crearCalendario, obtenerCalendario, borrarCalendario, completarReceta} = require('../controllers/semanalController');

// Importar las rutas de comentarios
const comentariosRoutes = require('./comentarios');

const router = new Router();

const Ingrediente = require('../models/Ingrediente');

// Rutas de autenticación
router.post('/register', authController.register);
router.post('/login', authController.login);

// Ruta protegida para obtener el perfil del usuario
router.get('/perfil', authenticate, obtenerUsuario);
router.put('/editar-perfil/:id', authenticate,editarUsuario);

// Usar las rutas de comentarios
router.use(comentariosRoutes.routes());

// Otras rutas...
router.post('/create-recipe', authenticate, crearReceta);
router.get('/receta/:id', authenticate, obtenerReceta);
router.post('/receta/:id/calificar', authenticate, calificarReceta);
router.get('/receta/:id/calificacion', authenticate, obtenerCalificacion);
router.get('/search', buscarRecetasYUsuarios);
router.post('/follow', authenticate, seguirUsuario);
router.get('/seguimientos/:id', authenticate, obtenerSeguimientos);
router.post('/unfollow', authenticate, dejarDeSeguirUsuario);
router.post('/receta/:id/favorito', authenticate, agregarFavorito);
router.delete('/receta/:id/favorito', authenticate, eliminarFavorito);
router.get('/favoritos/:id', authenticate, obtenerFavoritos);
router.get('/receta/:id/favorito/estado', authenticate, estaEnFavoritos);
router.get('/perfil/:id', authenticate, obtenerPerfil);
router.get('/receta/:id/promedio', obtenerPromedioCalificacion);
router.get('/seguidores/:id', authenticate, obtenerSeguidores);
router.post('/upload', subirImagen);
router.get('/recetasSimilares/:id', obtenerSimilares);


router.post('/crearCalendario',authenticate, crearCalendario);
router.get('/obtenerCalendarios',authenticate,obtenerCalendario);
router.delete('/borrarCalendario/:id',authenticate,borrarCalendario);
router.post('/completarReceta/:id', completarReceta);

// Ingredientes
router.get('/api/ingredientes', async (ctx) => {
    try {
        const ingredientes = await Ingrediente.findAll();
        ctx.body = ingredientes;
    } catch (error) {
        ctx.status = 500;
        ctx.body = { error: 'Error al obtener ingredientes' };
    }
});


module.exports = router;
