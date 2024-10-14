export const uploadImage = async (file) => {
    // Creamos un FormData para enviar la imagen al servidor
    const formData = new FormData();
    formData.append('image', file);

    try {
        // Realizamos la petición al endpoint donde se sube la imagen
        const response = await fetch('http://localhost:3000/upload', {
            method: 'POST',
            body: formData,
        });

        // Verificamos si la respuesta fue exitosa
        if (!response.ok) {
            throw new Error('Error al subir la imagen');
        }

        // Obtenemos la respuesta en formato JSON
        const data = await response.json();
        
        // Devolvemos la URL de la imagen subida
        return data.url; // Asegúrate de que el backend devuelva esta URL en el campo 'url'
    } catch (error) {
        console.error('Error al subir la imagen', error);
        return null; // Devolvemos null en caso de error para manejarlo adecuadamente
    }
};
export const validarCorreoElectronico = (correo) => {
    const regexCorreo = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
    return regexCorreo.test(correo);
};