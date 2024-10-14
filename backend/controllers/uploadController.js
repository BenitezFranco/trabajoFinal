const fs = require('fs');
const path = require('path');

const subirImagen = async (ctx) => {
    console.log("subirImagen");
    const { files } = ctx.request || {};
    console.log("Archivos recibidos:", files); // Muestra los archivos recibidos

    if (!files || !files.image) {
        ctx.status = 400;
        ctx.body = { message: 'No se ha proporcionado una imagen' };
        return;
    }

    const image = files.image;
    console.log("Propiedades de la imagen:", image); // Verifica las propiedades del objeto 'image'
    
    if (!image.filepath) { // Verifica que image.filepath esté definido
        ctx.status = 400;
        ctx.body = { message: 'No se pudo encontrar la ruta del archivo de imagen' };
        return;
    }

    const fileName = `${Date.now()}_${image.newFilename}`;
    console.log("Nombre del archivo:", fileName);
    console.log("Directorio actual:", __dirname);
    
    // Asegúrate de que el directorio existe
    ensureUploadsDir(); // Asegúrate de definir esta función

    const uploadPath = path.join(__dirname,'..', 'uploads', fileName);
    console.log("Ruta de carga:", uploadPath); // Verifica la ruta de carga

    try {
        // Mover el archivo a la carpeta 'uploads'
        const reader = fs.createReadStream(image.filepath);
        const stream = fs.createWriteStream(uploadPath);

        // Utiliza Promises para manejar la escritura
        const pipeline = new Promise((resolve, reject) => {
            reader.pipe(stream);
            stream.on('finish', resolve);
            stream.on('error', reject);
        });

        await pipeline; // Espera a que la escritura se complete

        // Suponiendo que sirves las imágenes estáticamente desde 'uploads'
        const baseUrl = `${ctx.request.protocol}://${ctx.request.host}`;
        const imageUrl = `${baseUrl}/uploads/${fileName}`;

        ctx.body = {
            message: 'Imagen subida con éxito',
            url: imageUrl,
        };
    } catch (error) {
        console.error('Error al subir la imagen', error);
        ctx.status = 500;
        ctx.body = { message: 'Error al subir la imagen' };
    }
};

const ensureUploadsDir = () => {
    const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }
};

module.exports = {
    subirImagen,
};
