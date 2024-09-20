const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');

const indexRoutes = require('./routes/index'); // Importa las rutas (incluye auth y perfil)

const app = new Koa();

// Configura CORS
app.use(cors());

// Configura el middleware para parsear el cuerpo de las solicitudes
app.use(bodyParser());

// Usa las rutas en la aplicación
app.use(indexRoutes.routes());
app.use(indexRoutes.allowedMethods());

// Inicia el servidor
app.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
});
