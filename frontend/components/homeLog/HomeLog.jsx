import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Seguimientos from '../seguimiento/Seguimiento';
import Seguidores from '../seguidores/Seguidores'; // Nuevo componente para Seguidores
import Footer from '../footer/Footer';
import Header from '../header/Header';
import SearchGrid from '../search/SearchGrid';

const Home = () => {
    const router = useRouter();
    const [usuarioAutenticado, setUsuarioAutenticado] = useState(false);
    const [loading, setLoading] = useState(true); // Estado de carga
    const [results, setResults] = useState([]);
    
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                setUsuarioAutenticado(true);
            } else {
                router.push('/login');
                return;
            }
    
            try {
                const response = await fetch(`http://localhost:3000/search?titulo=%`);
                const data = await response.json();
                setResults(data);
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            } finally {
                setLoading(false); // Cambiar a false una vez finalizado
            }
        };
        
        fetchData();
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
                    <SearchGrid results={results}></SearchGrid>
                </div>
            </main>
            <Footer />
        </div>
    );
        
};

export default Home;
