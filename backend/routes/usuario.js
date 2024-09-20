const Router = require('koa-router');
const router = new Router();
const authMiddleware = require('../middleware/authMiddleware');
const { editarPerfil } = require('../controllers/userController');

router.put('/editar-perfil', authMiddleware, editarPerfil);

module.exports = router;
