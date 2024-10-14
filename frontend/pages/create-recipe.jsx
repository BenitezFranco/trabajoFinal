import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import jwt from 'jsonwebtoken';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import PasoInstruccion from '@/components/receta/pasoInstruccion/PasoInstruccion';
import { uploadImage } from '@/utils/funcion';

const CreateRecipe = () => {
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        ingredientes: '',
        dificultad: 'Fácil',
        tiempo_preparacion: '',
        categorias: [],
    });
    const router = useRouter();
    const [id_usuario, setIdUsuario] = useState(null);
    const [successMessage, setSuccessMessage] = useState(''); // Estado para el mensaje de éxito
    const [pasos, setPasos] = useState([{ paso: '', imagen: null }]); // Estado para los pasos
    const [ingredientes, setIngredientes] = useState([{ nombre: '' }]);
    const [imagenReceta, setImagenReceta] = useState(null); // Estado para la imagen

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                const decodedToken = jwt.decode(token);
                setIdUsuario(decodedToken.id_usuario);
            }if (!token) {
                console.log('No token, redirecting to /login');
                router.push('/login');
                return;
            }
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handlePasoChange = (index, value) => {
        const newPasos = [...pasos];
        newPasos[index].paso = value;
        setPasos(newPasos);
    };

    const handleImagenChange = (index, file) => {
        const newPasos = [...pasos];
        newPasos[index].imagen = file;
        setPasos(newPasos);
    };

    const handleAddPaso = () => {
        setPasos([...pasos, { paso: '', imagen: null }]);
    };
    const handleRemovePaso = () => {
        if (pasos.length > 1) {
            setPasos(pasos.slice(0, -1));
        }
    };
    const handleAgregarIngrediente = () => {
        if (ingredientes.length < 10) { // Limitar a 10 ingredientes (o el número que desees)
            setIngredientes([...ingredientes, { nombre: '' }]);
        }
    };

    const handleQuitarIngrediente = (index) => {
        if (ingredientes.length > 1) {
            const nuevosIngredientes = ingredientes.filter((_, i) => i !== index);
            setIngredientes(nuevosIngredientes);
        }
    };

    const handleChangeIngrediente = (index, value) => {
        const nuevosIngredientes = [...ingredientes];
        nuevosIngredientes[index].nombre = value;
        setIngredientes(nuevosIngredientes);
    };
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImagenReceta(file);
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
        let fotoRecetaUrl = '';
        if (imagenReceta) {
            fotoRecetaUrl = await uploadImage(imagenReceta);
            if (!fotoRecetaUrl) {
                alert('Error al subir la imagen. Inténtalo de nuevo.');
                return;
            }
            console.log("imagen: ",fotoRecetaUrl);
        }

        const instrucciones = await Promise.all(
            pasos.map(async (paso) => {
                let imageUrl = null;

                if (paso.imagen) {
                    // Lógica para subir la imagen y obtener la URL.
                    // Ejemplo:
                    imageUrl = await uploadImage(paso.imagen);
                    console.log('url:',imageUrl);
                }

                return {
                    paso: paso.paso,
                    imagen: imageUrl,
                };
            })
        );

        const recetaData = {
            ...formData,
            foto_receta: fotoRecetaUrl,
            instrucciones,
            ingredientes,
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
        <div className="flex flex-col min-h-screen bg-gray-00">
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
                    <label htmlFor="foto_receta">Foto de la Receta:</label>
            <input
                type="file"
                name="foto_receta"
                accept="image/*"
                onChange={handleImageChange}
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
                        <h2 className="block text-gray-700 text-sm font-bold mb-2">Instrucciones:</h2>
                        {pasos.map((paso, index) => (
                            <PasoInstruccion
                                key={index}
                                index={index}
                                paso={paso}
                                handlePasoChange={handlePasoChange}
                                handleImagenChange={handleImagenChange}
                            />
                        ))}
                        <button
                            type="button"
                            onClick={handleAddPaso}
                            className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Agregar Paso
                        </button>
                        <button
                            type="button"
                            onClick={handleRemovePaso}
                            className="mt-2 ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            disabled={pasos.length <= 1} // Deshabilitado si solo hay un paso
                        >
                            Borrar Último Paso
                        </button>
                    </div>

                    <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    Ingredientes:
                </label>
                {ingredientes.map((ingrediente, index) => (
                    <div key={index} className="flex mb-2">
                        <input
                            type="text"
                            placeholder="Ingrediente"
                            value={ingrediente.nombre}
                            onChange={(e) => handleChangeIngrediente(index, e.target.value)}
                            className="border mb-2 p-2 flex-1"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => handleQuitarIngrediente(index)}
                            className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Quitar
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={handleAgregarIngrediente}
                    className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                    Agregar Ingrediente
                </button>
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
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth'})}
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