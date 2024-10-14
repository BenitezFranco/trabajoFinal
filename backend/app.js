const Koa = require('koa');
const { koaBody } = require('koa-body');
const cors = require('@koa/cors');
const serve = require('koa-static');
const path = require('path');
const mount = require('koa-mount');
const indexRoutes = require('./routes/index');


// Importa y sincroniza la base de datos
// const syncDatabase = require('./syncDB');
// syncDatabase();


const app = new Koa();

app.use(cors());

app.use(koaBody({
  multipart: true,
  formidable: {
    uploadDir: path.join(__dirname, 'uploads'),
    keepExtensions: true,
  }
}));

// Montar una subaplicación para servir archivos estáticos desde 'uploads'
app.use(mount('/uploads', serve(path.join(__dirname, 'uploads'))));

// Usa las rutas en la aplicación
app.use(indexRoutes.routes());
app.use(indexRoutes.allowedMethods());

app.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});
