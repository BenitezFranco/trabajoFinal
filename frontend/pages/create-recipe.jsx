import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import jwt from 'jsonwebtoken';
import Header from './Header';
import Footer from './Footer';

const CreateRecipe = () => {
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        instrucciones: '',
        ingredientes: '',
        dificultad: 'Fácil',
        tiempo_preparacion: '',
        categorias: [],
    });
    const router = useRouter();
    const [id_usuario, setIdUsuario] = useState(null);
    const [successMessage, setSuccessMessage] = useState(''); // Estado para el mensaje de éxito

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                const decodedToken = jwt.decode(token);
                setIdUsuario(decodedToken.id_usuario);
            }
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCheckboxChange = (e, categoriaIndex) => {
        const { checked } = e.target;
        if (checked) {
            setFormData({
                ...formData,
                categorias: [...formData.categorias, categoriaIndex], // Agregar el índice + 1
            });
        } else {
            setFormData({
                ...formData,
                categorias: formData.categorias.filter((cat) => cat !== categoriaIndex), // Remover el índice + 1
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const recetaData = {
            ...formData,
            fecha_publicacion: new Date().toISOString().split('T')[0],
            id_usuario: id_usuario,
        };

        const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://localhost:3000/create-recipe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(recetaData),
            });
            console.log('response:', response);
            if (response.ok) {
                setSuccessMessage('Receta creada con éxito'); // Mensaje de éxito
                setTimeout(() => {
                    router.push('/HomeLog'); // Redirigir al home después de un breve tiempo
                }, 2000); // Esperar 2 segundos antes de redirigir
            } else {
                console.error('Error al crear la receta');
            }
        } catch (error) {
            console.error('Error al crear la receta', error);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Header */}
            <Header />

            {/* Main content */}
            <main className="flex-grow flex flex-col items-center p-6">
                <h1 className="text-4xl font-bold mb-8">Crear Receta</h1>
                {successMessage && (
                    <div className="mb-4 text-green-600">{successMessage}</div> // Mensaje de éxito
                )}
                <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    {/* Resto del formulario... */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Título:
                        </label>
                        <input
                            type="text"
                            name="titulo"
                            value={formData.titulo}
                            onChange={handleChange}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Descripción:
                        </label>
                        <textarea
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        ></textarea>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Instrucciones:
                        </label>
                        <textarea
                            name="instrucciones"
                            value={formData.instrucciones}
                            onChange={handleChange}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        ></textarea>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Ingredientes:
                        </label>
                        <textarea
                            name="ingredientes"
                            value={formData.ingredientes}
                            onChange={handleChange}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        ></textarea>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Tiempo de Preparación (minutos):
                        </label>
                        <input
                            type="text"
                            name="tiempo_preparacion"
                            value={formData.tiempo_preparacion}
                            onChange={handleChange}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Dificultad:
                        </label>
                        <div className="flex items-center">
                            <label className="mr-4">
                                <input
                                    type="radio"
                                    name="dificultad"
                                    value="Fácil"
                                    checked={formData.dificultad === 'Fácil'}
                                    onChange={handleChange}
                                    className="mr-2"
                                />
                                Fácil
                            </label>
                            <label className="mr-4">
                                <input
                                    type="radio"
                                    name="dificultad"
                                    value="Media"
                                    checked={formData.dificultad === 'Media'}
                                    onChange={handleChange}
                                    className="mr-2"
                                />
                                Media
                            </label>
                            <label className="mr-4">
                                <input
                                    type="radio"
                                    name="dificultad"
                                    value="Difícil"
                                    checked={formData.dificultad === 'Difícil'}
                                    onChange={handleChange}
                                    className="mr-2"
                                />
                                Difícil
                            </label>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Categorías:
                        </label>
                        <div className="flex flex-wrap">
                            {[
                                'Vegetariano',
                                'Vegano',
                                'Desayuno',
                                'Sin TACC',
                                'Sin gluten',
                                'Postres',
                                'Saludables',
                                'Cenas',
                                'Almuerzos',
                                'Platos principales',
                                'Aperitivos',
                                'Bebidas',
                                'Dulces',
                                'Ensaladas',
                                'Sopas y cremas',
                            ].map((categoria, index) => (
                                <label key={index} className="mr-4 mb-2">
                                    <input
                                        type="checkbox"
                                        value={index + 1} // Enviar el índice + 1 como valor
                                        onChange={(e) => handleCheckboxChange(e, index + 1)} // Pasar el índice + 1 a la función
                                        className="hidden"
                                    />
                                    <span className={`inline-block cursor-pointer px-4 py-2 rounded-md border ${formData.categorias.includes(index + 1) ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-200 text-gray-700 border-gray-300'} hover:bg-blue-400 transition`}>
                                        {categoria}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Crear Receta
                    </button>
                </form>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default CreateRecipe;