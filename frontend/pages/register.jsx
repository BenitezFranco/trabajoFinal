import { useState } from 'react';
import { useRouter } from 'next/router'; // Importar useRouter
import { validarCorreoElectronico, validarContrasena } from '@/utils/funcion'; // Asegúrate de que solo se importa una vez

const Register = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        correo_electronico: '',
        contrasena: '',
        repetir_contrasena: '', // Nuevo campo para repetir la contraseña
    });
    const router = useRouter(); // Usar el hook useRouter para redirigir
    const [errorCorreo, setErrorCorreo] = useState('');
    const [errorContrasena, setErrorContrasena] = useState(''); // Nuevo estado para la validación de contraseñas

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleChangeEmail = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
        if (name === 'correo_electronico') {
            if (!validarCorreoElectronico(value)) {
                setErrorCorreo('Por favor ingresa un correo electrónico válido.');
            } else {
                setErrorCorreo('');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validar que las contraseñas coincidan
        if (formData.contrasena !== formData.repetir_contrasena) {
            setErrorContrasena('Las contraseñas no coinciden.');
            return;
        } else if (!validarContrasena(formData.contrasena)) {
            setErrorContrasena('La contraseña debe tener al menos 8 caracteres, incluir una letra mayúscula, una letra minúscula, un número y un carácter especial (por ejemplo: !, @, #, $, %, &, *).');
            return;
        } else {
            setErrorContrasena(''); // Limpiar el error si las contraseñas coinciden y son válidas
        }

        try {
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre: formData.nombre,
                    correo_electronico: formData.correo_electronico,
                    contrasena: formData.contrasena,
                }), // Enviar solo las propiedades necesarias
            });
            const result = await response.json();
            if (response.ok) {
                console.log('Registro exitoso', result);
                // Redirigir al login después de un registro exitoso
                router.push('/login');
            } else {
                console.error('Error en el registro', result);
            }
        } catch (error) {
            console.error('Error al registrar', error);
        }
    };

    const handleBackToHome = () => {
        router.push('/'); // Redirigir a la página de inicio
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="max-w-md w-full bg-white p-6 shadow-md rounded-lg">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">Registro</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="nombre">Nombre</label>
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            className="border border-gray-300 p-2 w-full rounded-md text-gray-900 focus:ring focus:ring-blue-200"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="correo_electronico">Correo Electrónico</label>
                        <input
                            type="email"
                            id="correo_electronico"
                            name="correo_electronico"
                            className="border border-gray-300 p-2 w-full rounded-md text-gray-900 focus:ring focus:ring-blue-200"
                            value={formData.correo_electronico}
                            onChange={handleChangeEmail}
                            required
                        />
                        {errorCorreo && (
                            <p className="text-red-500 text-sm mt-1">{errorCorreo}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="contrasena">Contraseña</label>
                        <input
                            type="password"
                            id="contrasena"
                            name="contrasena"
                            className="border border-gray-300 p-2 w-full rounded-md text-gray-900 focus:ring focus:ring-blue-200"
                            value={formData.contrasena}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="repetir_contrasena">Repetir Contraseña</label>
                        <input
                            type="password"
                            id="repetir_contrasena"
                            name="repetir_contrasena"
                            className="border border-gray-300 p-2 w-full rounded-md text-gray-900 focus:ring focus:ring-blue-200"
                            value={formData.repetir_contrasena}
                            onChange={handleChange}
                            required
                        />
                        {errorContrasena && (
                            <p className="text-red-500 text-sm mt-1">{errorContrasena}</p>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md w-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Registrar
                    </button>
                </form>
                <button
                    onClick={handleBackToHome}
                    className="mt-4 bg-gray-500 text-white font-bold py-2 px-4 rounded-md w-full hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                    Volver a Inicio
                </button>
            </div>
        </div>
    );
};

export default Register;
