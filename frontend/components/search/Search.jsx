import { useState } from 'react';
import Link from 'next/link';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import SearchGrid from './SearchGrid';
import OpcionBusqueda from './opcionBusqueda/OpcionBusqueda'; // Asegúrate de importar el componente correctamente

const Search = () => {
    const [opcionesBusqueda, setOpcionesBusqueda] = useState([{ filter: 'titulo', term: '' }]);
    const [results, setResults] = useState([]);
    const [searchSubmitted, setSearchSubmitted] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        setSearchSubmitted(true);
        setResults([]);

        try {
            const searchQueries = opcionesBusqueda.map(
                (opcion) => `${opcion.filter}=${opcion.term}`
            ).join('&');

            const response = await fetch(`http://localhost:3000/search?${searchQueries}`);
            const data = await response.json();
            setResults(data);
        } catch (error) {
            console.error('Error al realizar la búsqueda:', error);
        }
    };

    // Añadir una nueva opción de búsqueda
    const handleAddOption = () => {
        // Verificar si ya existe un filtro "titulo"
        const hasTitleFilter = opcionesBusqueda.some(opcion => opcion.filter === 'titulo');

        // Si no hay filtro "titulo", agregar uno nuevo por defecto (por ejemplo, "id_categoria")
        if (!hasTitleFilter) {
            setOpcionesBusqueda([...opcionesBusqueda, { filter: 'id_categoria', term: '' }]);
        } else {
            // Si ya hay un filtro "titulo", puedes agregar otros tipos de filtro
            setOpcionesBusqueda([...opcionesBusqueda, { filter: 'id_categoria', term: '' }]); // Cambia esto al filtro por defecto que quieras
        }
    };

    // Quitar una opción de búsqueda
    const handleRemoveOption = (index) => {
        const newOptions = opcionesBusqueda.filter((_, i) => i !== index);
        setOpcionesBusqueda(newOptions);
    };

    // Manejar el cambio de un filtro específico
    const handleFilterChange = (index, newFilter) => {
        const newOptions = [...opcionesBusqueda];
        newOptions[index].filter = newFilter;
        newOptions[index].term = ''; // Resetea el término al cambiar el filtro
        setOpcionesBusqueda(newOptions);
    };

    // Manejar el cambio de un término específico
    const handleTermChange = (index, newTerm) => {
        const newOptions = [...opcionesBusqueda];
        newOptions[index].term = newTerm;
        setOpcionesBusqueda(newOptions);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-00">
                <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold text-center mb-6">Buscar Recetas o Usuarios</h1>
                    <form onSubmit={handleSearch} className="mb-4">
                        <div className="flex flex-col space-y-4">
                            {opcionesBusqueda.map((opcion, index) => (
                                <OpcionBusqueda
                                    key={index}
                                    index={index}
                                    filter={opcion.filter}
                                    term={opcion.term}
                                    onFilterChange={handleFilterChange}
                                    onTermChange={handleTermChange}
                                    onRemove={handleRemoveOption}
                                />
                            ))}

                            <button
                                type="button"
                                onClick={handleAddOption}
                                className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                Agregar Filtro
                            </button>

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
