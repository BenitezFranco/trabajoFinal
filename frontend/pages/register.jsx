import { useState } from 'react';
import { useRouter } from 'next/router'; // Importar useRouter

const Register = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        correo_electronico: '',
        contrasena: '',
    });
    const router = useRouter(); // Usar el hook useRouter para redirigir

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
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
                            name="nombre" // Nombre del campo para que el estado se actualice correctamente
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
                            name="correo_electronico" // Nombre del campo para que el estado se actualice correctamente
                            className="border border-gray-300 p-2 w-full rounded-md text-gray-900 focus:ring focus:ring-blue-200"
                            value={formData.correo_electronico}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="contrasena">Contraseña</label>
                        <input
                            type="password"
                            id="contrasena"
                            name="contrasena" // Nombre del campo para que el estado se actualice correctamente
                            className="border border-gray-300 p-2 w-full rounded-md text-gray-900 focus:ring focus:ring-blue-200"
                            value={formData.contrasena}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md w-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Registrar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
