import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import { uploadImage } from '@/utils/funcion';

const EditarPerfil = () => {
    const [perfil, setPerfil] = useState(null);
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [imagenPerfil, setImagenPerfil] = useState(null);
    const [cargando, setCargando] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchPerfil = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.log('No token, redirecting to /login');
                router.push('/login');
                return;
            }

            console.log('Token found:', token);

            try {
                const response = await fetch('http://localhost:3000/perfil', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    const result = await response.json();
                    setPerfil(result);
                } else if (response.status === 401 || response.status === 403) {
                    alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
                    localStorage.removeItem('token');
                    router.push('/login');
                }
            } catch (error) {
                console.error('Error fetching profile', error);
                setError('Error al obtener el perfil');
            }
        };

        fetchPerfil();
    }, [router]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPerfil({ ...perfil, [name]: value });
    };

    const handleCheckboxChange = (e) => {
        const { checked } = e.target;
        setPerfil({ ...perfil, es_visible: checked });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImagenPerfil(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCargando(true);
        setMensaje('');
        let imageUrl = perfil.foto_perfil;

        if (imagenPerfil) {
            imageUrl = await uploadImage(imagenPerfil);
            if (!imageUrl) {
                setError('Error al subir la imagen. Inténtalo de nuevo.');
                setCargando(false);
                return;
            }
        }

        const updatedPerfil = { ...perfil, foto_perfil: imageUrl };

        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`http://localhost:3000/editar-perfil/${perfil.id_usuario}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updatedPerfil),
            });

            if (response.status === 200) {
                setMensaje('Perfil actualizado con éxito. Redirigiendo...');
                setTimeout(() => {
                    router.push(`/perfil/${perfil.id_usuario}`);
                }, 2000);
            } else {
                setError('Error al actualizar el perfil. Inténtalo de nuevo más tarde.',error);
            }
        } catch (error) {
            console.error('Error al actualizar el perfil', error);
            setError('Error al actualizar el perfil. Inténtalo de nuevo.');
        } finally {
            setCargando(false);
        }
    };

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    if (!perfil) {
        return <p>Cargando perfil...</p>;
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow p-6 bg-gray-100">
                <h1 className="text-2xl font-bold mb-4">Editar Perfil</h1>
                {mensaje && <p className="text-green-600 mb-4">{mensaje}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <p>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Nombre: {perfil.nombre}
                            </label>
                        </p>
                    </div>
                    <div className="mb-4">
                        <p>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Correo Electrónico: {perfil.correo_electronico}
                            </label>
                        </p>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Descripción breve:
                        </label>
                        <textarea
                            name="descripcion_breve"
                            value={perfil.descripcion_breve}
                            onChange={handleInputChange}
                            maxLength="30"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Presentación:
                        </label>
                        <textarea
                            name="presentacion"
                            value={perfil.presentacion}
                            onChange={handleInputChange}
                            maxLength="250"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Foto de perfil:
                        </label>
                        <input
                            type="file"
                            name="foto_perfil"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="py-2 px-3"
                        />
                        {perfil.foto_perfil && (
                            <img
                                src={perfil.foto_perfil}
                                alt="Foto de perfil"
                                className="mt-4 w-32 h-32 rounded-full object-cover"
                            />
                        )}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Mostrar correo
                        </label>
                        <input
                            type="checkbox"
                            checked={perfil.es_visible}
                            onChange={handleCheckboxChange}
                            className="mr-2 leading-tight"
                        />
                        <span className="text-sm text-gray-700">Marcar para hacerlo visible</span>
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        disabled={cargando}
                    >
                        {cargando ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </form>
            </main>
            <Footer />
        </div>
    );
};

export default EditarPerfil;