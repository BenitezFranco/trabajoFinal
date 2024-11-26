import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import Footer from '../footer/Footer';
import Header from '../header/Header';
//import SearchGrid from '../search/SearchGrid';
import GridPrueba from '../search/gridPrueba';

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
    


    return (
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow p-6 bg-gray-100 flex justify-center items-center">
            <div className="grid grid-cols-6 grid-rows-5 gap-4 w-full max-w-7xl">
              {/* Contenedor de bienvenida */}
              <div className="row-span-5 col-span-6 flex flex-col items-center">
                <h1 className="text-3xl font-bold mb-4 text-center">Bienvenido a Foodbook</h1>
                <p className="text-lg text-center mb-8">Descubre, crea y comparte deliciosas recetas.</p>
              </div>
              
              {/* Sección de búsqueda */}
              <div className="col-span-6 row-span-4 flex justify-center items-center">
                <GridPrueba results={results} />
              </div>
              
              {/* Ajuste para el footer (si es necesario colocar en la parte inferior de la grid) */}
              <div className="col-span-6 flex justify-center items-center">
               
              </div>
            </div>
          </main>
          <Footer />
        </div>
      );
      
        
};

export default Home;
