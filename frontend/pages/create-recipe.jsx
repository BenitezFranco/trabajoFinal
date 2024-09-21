import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import jwt from 'jsonwebtoken';


const CreateRecipe = () => {
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        instrucciones: '',
        ingredientes: '',
        dificultad: 'Fácil', // Valor predeterminado
        tiempo_preparacion: '',
        categorias: [],
    });
    const router = useRouter();

    const [id_usuario, setIdUsuario] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined') { // Verifica si estás en el cliente
            const token = localStorage.getItem('token');
            if (token) {
                // Decodificar el token
                const decodedToken = jwt.decode(token); // Utiliza el método decode de jsonwebtoken
                console.log(decodedToken);
                setIdUsuario(decodedToken.id_usuario); // Asegúrate de que 'id_usuario' esté en el payload del token
            }
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setFormData({
                ...formData,
                categorias: [...formData.categorias, value],
            });
        } else {
            setFormData({
                ...formData,
                categorias: formData.categorias.filter((cat) => cat !== value),
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const recetaData = {
            titulo: formData.titulo,
            descripcion: formData.descripcion,
            instrucciones: formData.instrucciones,
            ingredientes: formData.ingredientes,
            dificultad: formData.dificultad,
            tiempo_preparacion: formData.tiempo_preparacion,
            fecha_publicacion: new Date().toISOString().split('T')[0],
            id_usuario: id_usuario,
            categorias: formData.categorias,
        };
        const token = localStorage.getItem('token');
        console.log(token);
        console.log(recetaData);
        try {
            // Insertar en la tabla receta
            const response = await fetch('http://localhost:3000/create-recipe', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(recetaData),
            });

            const result = await response.json();
            /** 
            if (response.ok) {
                // Insertar en la tabla receta_categoria para cada categoría seleccionada
                const id_receta = result.id_receta;
                for (const id_categoria of formData.categorias) {
                    await fetch('http://localhost:3000/receta_categoria', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id_receta, id_categoria }),
                    });
                }
                
            } else {
                console.error('Error al crear la receta', result);
            }*/
                router.push('/perfil');
        } catch (error) {
            console.error('Error al crear la receta', error);
        }
    };

    return (
        <div>
            <h1>Crear Receta</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Título:
                    <input
                        type="text"
                        name="titulo"
                        value={formData.titulo}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Descripción:
                    <textarea
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleChange}
                        required
                    ></textarea>
                </label>

                <label>
                    Instrucciones:
                    <textarea
                        name="instrucciones"
                        value={formData.instrucciones}
                        onChange={handleChange}
                        required
                    ></textarea>
                </label>

                <label>
                    Ingredientes:
                    <textarea
                        name="ingredientes"
                        value={formData.ingredientes}
                        onChange={handleChange}
                        required
                    ></textarea>
                </label>

                <label>
                    Tiempo de Preparación (minutos):
                    <input
                        type="text"
                        name="tiempo_preparacion"
                        value={formData.tiempo_preparacion}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Dificultad:
                    <label>
                        <input
                            type="radio"
                            name="dificultad"
                            value="Fácil"
                            checked={formData.dificultad === 'Fácil'}
                            onChange={handleChange}
                        />
                        Fácil
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="dificultad"
                            value="Media"
                            checked={formData.dificultad === 'Media'}
                            onChange={handleChange}
                        />
                        Media
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="dificultad"
                            value="Difícil"
                            checked={formData.dificultad === 'Difícil'}
                            onChange={handleChange}
                        />
                        Difícil
                    </label>
                </label>

                <label>
                    Categorías:
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
                        <label key={index}>
                            <input
                                type="checkbox"
                                value={index + 1}
                                onChange={handleCheckboxChange}
                            />
                            {categoria}
                        </label>
                    ))}
                </label>

                <button type="submit">Crear Receta</button>
            </form>
        </div>
    );
};

export default CreateRecipe;
