//routes/index.js
const Comentario = require('../models/Comentario'); // Importa tu modelo de comentarios
const Router = require('koa-router');
const authController = require('../controllers/authController');
const authenticate = require('../middleware/authMiddleware');
const { crearReceta, obtenerReceta, calificarReceta, obtenerCalificacion, obtenerPromedioCalificacion } = require('../controllers/recetaController');
const { buscarRecetasYUsuarios } = require('../controllers/searchController');
const { seguirUsuario, obtenerSeguimientos, dejarDeSeguirUsuario, obtenerPerfil, obtenerSeguidores } = require('../controllers/seguimientoController');
const { agregarFavorito, eliminarFavorito, obtenerFavoritos, estaEnFavoritos } = require('../controllers/favoritoController'); // Controlador de favoritos
const Usuario = require('../models/Usuario');
const {subirImagen} = require('../controllers/uploadController');

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

// Obtener comentarios de una receta
router.get('/receta/:id/comentarios', async (ctx) => {
    const id_receta = ctx.params.id;
    try {
        const comentarios = await Comentario.findAll({
            where: { id_receta },
            include: [
                { model: Usuario, attributes: ['nombre', 'foto_perfil'] }
            ]
        });
        ctx.body = comentarios; // Asegúrate de que esto sea un array
    } catch (error) {
        console.error('Error al obtener los comentarios:', error);
        ctx.status = 500;
        ctx.body = { error: 'Error al obtener los comentarios' };
    }
});


router.post('/receta/:id/comentarios', authenticate, async (ctx) => {
    const id_receta = ctx.params.id;
    const id_usuario = ctx.state.user.id_usuario;
    const { texto } = ctx.request.body;

    try {
        const nuevoComentario = await Comentario.create({
            texto,
            id_receta,
            id_usuario,
        });
        ctx.status = 201;
        ctx.body = nuevoComentario;
    } catch (error) {
        console.error('Error al crear el comentario:', error);
        ctx.status = 500;
        ctx.body = { error: 'Error al crear el comentario' };
    }
});


// Crear receta (protegida)
router.post('/create-recipe', authenticate, crearReceta);

// Obtener receta por ID (protegida)
router.get('/receta/:id', authenticate, obtenerReceta);

// Calificar receta (protegida)
router.post('/receta/:id/calificar', authenticate, calificarReceta);

router.get('/receta/:id/calificacion', authenticate, obtenerCalificacion);

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

router.get('/receta/:id/promedio', obtenerPromedioCalificacion);

// Ruta para obtener la lista de seguidores (protegida)
router.get('/seguidores', authenticate, obtenerSeguidores);

// Ruta para subir imagen 
router.post('/upload',subirImagen);

module.exports = router;

