import { useState } from 'react';
import { useRouter } from 'next/router'; // Importar useRouter

const Login = () => {
    const [formData, setFormData] = useState({
        correo_electronico: '',
        contrasena: '',
    });
    const [error, setError] = useState('');
    const router = useRouter(); // Usar el hook useRouter

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        // Lógica para enviar datos de login a la API
        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            if (response.ok) {
                // Guardar el token en localStorage
                localStorage.setItem('token', result.token);
                console.log('Token:', result.token);
                // Redirigir al perfil del usuario
                router.push('/perfil'); // Redirige a la página de perfil
            } else {
                // Mostrar error si las credenciales son incorrectas
                setError(result.error || 'Error en el login');
            }
        } catch (error) {
            console.error('Error al iniciar sesión', error);
            setError('Error al iniciar sesión');
        }
    };

    return (
        <div>
            <h1>Iniciar Sesión</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    Correo Electrónico:
                    <input
                        type="email"
                        name="correo_electronico"
                        value={formData.correo_electronico}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Contraseña:
                    <input
                        type="password"
                        name="contrasena"
                        value={formData.contrasena}
                        onChange={handleChange}
                        required
                    />
                </label>
                <button type="submit">Iniciar Sesión</button>
            </form>
        </div>
    );
};

export default Login;