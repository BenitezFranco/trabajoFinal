import { useState } from 'react';
import Link from 'next/link';

const Search = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('titulo');
    const [results, setResults] = useState([]);
    const [searchSubmitted, setSearchSubmitted] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        setSearchSubmitted(true);

        try {
            const response = await fetch(`http://localhost:3000/search?filter=${filter}&term=${searchTerm}`);
            const data = await response.json();
            setResults(data);
        } catch (error) {
            console.error('Error al realizar la búsqueda:', error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
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
                            onChange={(e) => setFilter(e.target.value)}
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

                {/* Mostrar los resultados */}
                {searchSubmitted && results.length > 0 ? (
                    <ul className="space-y-4">
                        {results.map((item) => (
                            <li 
                                key={item.id_usuario || item.id_receta} 
                                className="border border-gray-300 rounded-lg p-4 bg-gray-50 shadow-md hover:bg-gray-100"
                            >
                                {item.nombre ? (
                                    <span className="text-lg font-medium">Usuario: {item.nombre} (ID: {item.id_usuario})</span>
                                ) : (
                                    <Link href={`/recipe/${item.id_receta}`} className="text-lg font-medium text-blue-600 hover:underline">
                                        Receta: {item.titulo}
                                        <p className="text-sm text-gray-600">Descripción: {item.descripcion}</p>
                                        <p className="text-sm text-gray-500">Dificultad: {item.dificultad}</p>
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : searchSubmitted && results.length === 0 ? (
                    <p className="text-gray-500 text-center">No se encontraron resultados</p>
                ) : null}
            </div>
        </div>
    );
};

export default Search;
