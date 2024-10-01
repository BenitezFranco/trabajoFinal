//login.jsx
import { useState } from 'react';
import { useRouter } from 'next/router';

const Login = () => {
    const [formData, setFormData] = useState({
        correo_electronico: '',
        contrasena: '',
    });
    const [error, setError] = useState('');
    const router = useRouter();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            if (response.ok) {
                localStorage.setItem('token', result.token);
                router.push('/HomeLog');
            } else {
                setError(result.error || 'Error en el login');
            }
        } catch (error) {
            console.error('Error al iniciar sesión', error);
            setError('Error al iniciar sesión');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="max-w-md w-full bg-white p-6 shadow-md rounded-lg">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">Iniciar Sesión</h1>
                {error && <p className="text-red-600 mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="correo_electronico">
                            Correo Electrónico
                        </label>
                        <input
                            type="email"
                            id="correo_electronico"
                            name="correo_electronico"
                            className="border border-gray-300 p-2 w-full rounded-md text-gray-900 focus:ring focus:ring-blue-200"
                            value={formData.correo_electronico}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="contrasena">
                            Contraseña
                        </label>
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
                    <button
                        type="submit"
                        className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md w-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Iniciar Sesión
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
