import { useState } from 'react';
import Link from 'next/link';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import SearchGrid from './SearchGrid';

const Search = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('titulo');
    const [results, setResults] = useState([]);
    const [searchSubmitted, setSearchSubmitted] = useState(false);
    
    // Añadimos este estado para controlar el tipo de búsqueda
    const [searchType, setSearchType] = useState('recetas'); // 'recetas' o 'usuarios'

    const handleSearch = async (e) => {
        e.preventDefault();
        setSearchSubmitted(true);
        setResults([]); // Reiniciamos los resultados antes de la búsqueda

        try {
            const response = await fetch(`http://localhost:3000/search?filter=${filter}&term=${searchTerm}`);
            const data = await response.json();
            setResults(data);
        } catch (error) {
            console.error('Error al realizar la búsqueda:', error);
        }
    };

    const handleFilterChange = (e) => {
        const newFilter = e.target.value;
        setFilter(newFilter);
        
        // Aquí determinamos el tipo de búsqueda y reiniciamos el estado
        if (newFilter === "usuario") {
            setSearchType('usuarios');
        } else {
            setSearchType('recetas');
        }
        
        // Reiniciamos los resultados y el estado de búsqueda al cambiar el filtro
        setSearchSubmitted(false);
        setResults([]); // Reiniciar resultados
        setSearchTerm(''); // Reiniciar término de búsqueda
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-00">
                <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold text-center mb-6">Buscar Recetas o Usuarios</h1>
                    <form onSubmit={handleSearch} className="mb-4">
                        <div className="flex flex-col space-y-4">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Escribe aquí para buscar"
                                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            <select
                                value={filter}
                                onChange={handleFilterChange} // Cambiamos a la nueva función
                                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="titulo">Por Título</option>
                                <option value="ingredientes">Por Ingredientes</option>
                                <option value="dificultad">Por Dificultad</option>
                                <option value="creador">Por Creador (nombre de usuario)</option>
                                <option value="usuario">Buscar Usuario</option>
                            </select>

                            <button
                                type="submit"
                                className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Buscar
                            </button>
                        </div>
                    </form>
                </div>
                
                {/* Mostrar los resultados */}
                {searchSubmitted && results.length > 0 ? (
                    <SearchGrid results={results} />
                ) : searchSubmitted && results.length === 0 ? (
                    <p className="text-gray-500 text-center">No se encontraron resultados</p>
                ) : null}
            </div>   
            <Footer />
        </div>
    );
};

export default Search;
