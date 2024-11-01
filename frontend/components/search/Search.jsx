import { useState } from 'react';
import Link from 'next/link';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import SearchGrid from './SearchGrid';
import OpcionBusqueda from './opcionBusqueda/OpcionBusqueda';

const Search = () => {
    const [opcionesBusqueda, setOpcionesBusqueda] = useState([{ filter: 'titulo', term: '' }]);
    const [results, setResults] = useState([]);
    const [searchSubmitted, setSearchSubmitted] = useState(false);
    const [modoBusqueda, setModoBusqueda] = useState('receta'); // Puede ser 'receta' o 'usuario'
    const [usuarioTerm, setUsuarioTerm] = useState(''); // Término para la búsqueda por usuario
    const [errorMessage, setErrorMessage] = useState(''); // Estado para mensaje de error

    const handleSearch = async (e) => {
        e.preventDefault();
        setSearchSubmitted(true);
        setResults([]);

        if (modoBusqueda === 'usuario' && usuarioTerm.trim() === '') {
            setErrorMessage('Por favor, ingresa un nombre de usuario para buscar.'); // Mensaje de error si el campo está vacío
            return;
        }

        setErrorMessage(''); // Limpiar el mensaje de error si hay un término

        try {
            let searchQueries = '';

            if (modoBusqueda === 'receta') {
                searchQueries = opcionesBusqueda
                    .map((opcion) => `${opcion.filter}=${opcion.term}`)
                    .join('&');
            } else if (modoBusqueda === 'usuario') {
                searchQueries = `usuario=${usuarioTerm}`;
            }

            const response = await fetch(`http://localhost:3000/search?${searchQueries}`);
            const data = await response.json();
            setResults(data);
        } catch (error) {
            console.error('Error al realizar la búsqueda:', error);
        }
    };

    // Cambiar el modo de búsqueda
    const handleModoBusquedaChange = (modo) => {
        setModoBusqueda(modo);
        setOpcionesBusqueda([{ filter: 'titulo', term: '' }]); // Reinicia las opciones de búsqueda
        setUsuarioTerm(''); // Reinicia el término de búsqueda por usuario
        setSearchSubmitted(false); // Resetea los resultados
        setErrorMessage(''); // Limpiar el mensaje de error
    };

    // Añadir una nueva opción de búsqueda para recetas
    const handleAddOption = () => {
        setOpcionesBusqueda([...opcionesBusqueda, { filter: 'id_categoria', term: '' }]);
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
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold text-center mb-6">Buscar Recetas o Usuarios</h1>

                    {/* Selector de modo de búsqueda */}
                    <div className="flex justify-center space-x-4 mb-4">
                        <button
                            onClick={() => handleModoBusquedaChange('receta')}
                            className={`py-2 px-4 rounded-lg ${
                                modoBusqueda === 'receta' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                            }`}
                        >
                            Buscar por Receta
                        </button>
                        <button
                            onClick={() => handleModoBusquedaChange('usuario')}
                            className={`py-2 px-4 rounded-lg ${
                                modoBusqueda === 'usuario' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                            }`}
                        >
                            Buscar por Usuario
                        </button>
                    </div>

                    {/* Formulario de búsqueda */}
                    <form onSubmit={handleSearch} className="mb-4">
                        <div className="flex flex-col space-y-4">
                            {modoBusqueda === 'receta' ? (
                                // Formulario de búsqueda de recetas con múltiples opciones
                                <>
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
                                </>
                            ) : (
                                // Input de búsqueda para buscar por usuario
                                <>
                                    <input
                                        type="text"
                                        placeholder="Buscar por nombre de usuario"
                                        value={usuarioTerm}
                                        onChange={(e) => setUsuarioTerm(e.target.value)}
                                        className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errorMessage && (
                                        <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
                                    )}
                                </>
                            )}

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
