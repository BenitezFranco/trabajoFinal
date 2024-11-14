import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Seguimientos from '../seguimiento/Seguimiento';
import Seguidores from '../seguidores/Seguidores'; // Nuevo componente para Seguidores
import Footer from '../footer/Footer';
import Header from '../header/Header';

const Home = () => {
    const router = useRouter();
    const [usuarioAutenticado, setUsuarioAutenticado] = useState(false);
    const [loading, setLoading] = useState(true); // Estado de carga

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setUsuarioAutenticado(true);
        } else {
            router.push('/login');
            return;
        }
        setLoading(false); // Cambiar a false una vez verificado
    }, [router]);

    const handlePerfilClick = () => {
        router.push('/perfil');
    };

    const handleCrearRecetaClick = () => {
        router.push('/create-recipe');
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow p-6 bg-gray-100 flex justify-center items-center">
                <div className="flex flex-col items-center w-full max-w-md"> {/* Contenedor central */}
                    <h1 className="text-3xl font-bold mb-4 text-center">Bienvenido a Foodbook</h1>
                    <p className="text-lg text-center mb-8">Descubre, crea y comparte deliciosas recetas.</p>
                    
                    {usuarioAutenticado ? (
                        <div className="flex flex-col space-y-4">
                            <button 
                                onClick={handlePerfilClick} 
                                className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600"
                            >
                                Ir a mi perfil
                            </button>
                            <button 
                                onClick={handleCrearRecetaClick} 
                                className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600"
                            >
                                Crear una nueva receta
                            </button>
                        </div>
                    ) : (
                        <p className="text-lg text-center">Inicia sesión para acceder a tu perfil y crear recetas.</p>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
        
};

export default Home;
