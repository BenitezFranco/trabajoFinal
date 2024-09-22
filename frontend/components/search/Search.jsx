import { useState } from 'react';
import Link from 'next/link';

const Search = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('titulo'); // Estado para el filtro seleccionado
    const [results, setResults] = useState([]);

    const handleSearch = async (e) => {
        e.preventDefault();

        // Realiza la búsqueda enviando el filtro y el término al backend
        try {
            const response = await fetch(`http://localhost:3000/search?filter=${filter}&term=${searchTerm}`);
            const data = await response.json();
            setResults(data);
        } catch (error) {
            console.error('Error al realizar la búsqueda:', error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Escribe aquí para buscar"
                />
                
                {/* Dropdown para seleccionar el filtro */}
                <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="titulo">Por Título</option>
                    <option value="ingredientes">Por Ingredientes</option>
                    <option value="dificultad">Por Dificultad</option>
                    <option value="creador">Por Creador (nombre de usuario)</option>
                    <option value="usuario">Buscar Usuario</option>
                </select>

                <button type="submit">Buscar</button>
            </form>

            {/* Mostrar los resultados */}
            {results.length > 0 ? (
                <ul>
                    {results.map((item) => (
                        <li key={item.id_usuario || item.id_receta} >
                            {item.nombre ? (
                                <span>Usuario: {item.nombre} (ID: {item.id_usuario})</span>
                            ) : (
                                <Link href={`/recipe/${item.id_receta}`}>
                                <p>Receta: {item.titulo} Descripcion: {item.descripcion}</p>
                                </Link>    
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No se encontraron resultados</p>
            )}
        </div>
    );
};

export default Search;
