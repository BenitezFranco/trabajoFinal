// pages/register.js
import { useState } from 'react';

const Register = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        correo_electronico: '',
        contrasena: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Lógica para enviar datos de registro a la API
        try {
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            if (response.ok) {
                // Manejo de respuesta exitosa
                console.log('Registro exitoso', result);
            } else {
                // Manejo de error
                console.error('Error en el registro', result);
            }
        } catch (error) {
            console.error('Error al registrar', error);
        }
    };

    return (
        <div>
            <h1>Registro</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Nombre:
                    <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
                </label>
                <label>
                    Correo Electrónico:
                    <input type="email" name="correo_electronico" value={formData.correo_electronico} onChange={handleChange} required />
                </label>
                <label>
                    Contraseña:
                    <input type="password" name="contrasena" value={formData.contrasena} onChange={handleChange} required />
                </label>
                <button type="submit">Registrar</button>
            </form>
        </div>
    );
};

export default Register;