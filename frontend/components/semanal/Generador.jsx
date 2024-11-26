import { useState } from "react";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import SearchGrid from "../search/SearchGrid";
import OpcionBusqueda from "../search/opcionBusqueda/OpcionBusqueda";
import { useRouter } from 'next/router';  // Asegúrate de importar useRouter

const Generador = () => {
  const router = useRouter();  // Inicializamos el router
  const [opcionesBusqueda, setOpcionesBusqueda] = useState([{ filter: "titulo", term: "" }]);
  const [results, setResults] = useState([]);
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");  // Estado para el mensaje de éxito

  // Función para seleccionar aleatoriamente los resultados
  const getRandomResults = (results) => {
    const shuffled = [...results]; // Copiar el array original
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Seleccionar un índice aleatorio
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Intercambiar los elementos
    }

    // Si hay menos de 7 resultados, repetir hasta llegar a 7
    const randomResults = [];
    while (randomResults.length < 7) {
      randomResults.push(...shuffled);
    }

    // Retornar solo los primeros 7 resultados
    return randomResults.slice(0, 7);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchSubmitted(true);
    setResults([]);
    setErrorMessage("");

    try {
      const searchQueries = opcionesBusqueda
        .map((opcion) => `${opcion.filter}=${opcion.term}`)
        .join("&");

      const response = await fetch(`http://localhost:3000/search?${searchQueries}`);
      const data = await response.json();

      // Filtrar aleatoriamente los resultados y asegurarnos de que haya 7
      const randomResults = getRandomResults(data);
      setResults(randomResults);
    } catch (error) {
      console.error("Error al realizar la búsqueda:", error);
      setErrorMessage("Error al realizar la búsqueda");
    }
  };

  const handleAddOption = () => {
    setOpcionesBusqueda([...opcionesBusqueda, { filter: "id_categoria", term: "" }]);
  };

  const handleRemoveOption = (index) => {
    const newOptions = opcionesBusqueda.filter((_, i) => i !== index);
    setOpcionesBusqueda(newOptions);
  };

  const handleFilterChange = (index, newFilter) => {
    setOpcionesBusqueda((prevOpciones) =>
      prevOpciones.map((opcion, i) => (i === index ? { ...opcion, filter: newFilter, term: "" } : opcion))
    );
  };

  const handleTermChange = (index, newTerm) => {
    const newOptions = [...opcionesBusqueda];
    newOptions[index].term = newTerm;
    setOpcionesBusqueda(newOptions);
  };

  // Nueva función para manejar la creación del calendario
  const handleCrearCalendario = async () => {
    const token = localStorage.getItem("token");
    try {
      const idsRecetas = results.map((receta) => receta.id_receta);
      const response = await fetch("http://localhost:3000/crearCalendario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ idsRecetas }),
      });
      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor");
      }
      const data = await response.json();
      console.log("Calendario creado:", data);

      // Mostrar mensaje de éxito
      setSuccessMessage("Calendario creado con éxito!");

      // Redirigir después de 2 segundos
      setTimeout(() => {
        router.push("http://localhost:3001/calendario-semanal");
      }, 2000);
    } catch (error) {
      console.error("Error al crear el calendario:", error);
      setErrorMessage("Error al crear el calendario");
    }
  };

  const handleVerTodas = () => {
    setOpcionesBusqueda([{ filter: "titulo", term: "" }]);
    handleSearch(new Event("submit"));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow bg-gray-100 p-6" role="main">
        <div className="grid grid-cols-7 grid-rows-4 gap-6 max-w-6xl mx-auto">
          {/* Sección de Búsqueda */}
          <div className="col-span-3 row-span-4 bg-white p-6 rounded-xl shadow-lg">
            <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Buscar Recetas</h1>

            {/* Formulario de búsqueda */}
            <form onSubmit={handleSearch} className="mb-6">
              <div className="flex flex-col space-y-4">
                {opcionesBusqueda.map((opcion, index) => (
                  <>
                  <label for="filtros" class="text-gray-700 font-medium">
                          Filtrar por:
                        </label>
                  <OpcionBusqueda
                    key={index}
                    index={index}
                    filter={opcion.filter}
                    term={opcion.term}
                    onFilterChange={handleFilterChange}
                    onTermChange={handleTermChange}
                    onRemove={handleRemoveOption}
                  />
                  </>
                ))}
                <button
                  type="button"
                  onClick={handleAddOption}
                  className="bg-transparent text-gray-700 font-semibold border-2 border-gray-700 rounded-full py-2 px-6 mt-4 hover:bg-gray-200 focus:outline-none transition duration-300 transform hover:scale-105"
                >
                  <span className="text-sm">+ Agregar Filtro</span>
                </button>

                <button
                  type="submit"
                  className="bg-transparent text-gray-700 font-semibold border-2 border-gray-700 rounded-full py-2 px-6 mt-4 hover:bg-gray-200 focus:outline-none transition duration-300 transform hover:scale-105"
                >
                  Buscar
                </button>

                <button
                  type="button"
                  onClick={handleVerTodas}
                  className="bg-transparent text-gray-700 font-semibold border-2 border-gray-700 rounded-full py-2 px-6 mt-4 hover:bg-gray-200 focus:outline-none transition duration-300 transform hover:scale-105"
                >
                  Calendario Aleatorio
                </button>
              </div>
            </form>
          </div>

          {/* Sección de Resultados */}
          <div className="col-span-5 row-span-4 col-start-4 bg-white p-6 rounded-xl shadow-lg">
            {searchSubmitted && results.length > 0 ? (
              <div>
                <SearchGrid results={results} />
                <button
                  type="button"
                  onClick={handleCrearCalendario}
                  className="bg-transparent text-gray-700 font-semibold border-2 border-gray-700 rounded-full py-2 px-6 mt-4 hover:bg-gray-200 focus:outline-none transition duration-300 transform hover:scale-105"
                >
                  Crear Calendario
                </button>
              </div>
            ) : searchSubmitted && results.length === 0 ? (
              <p className="text-gray-500 text-center">No se encontraron resultados</p>
            ) : null}
          </div>
        </div>

        {/* Mostrar mensaje de éxito o error */}
        {successMessage && (
          <div className="text-green-600 text-center mt-4">
            <p>{successMessage}</p>
          </div>
        )}

        {errorMessage && (
          <div className="text-red-600 text-center mt-4">
            <p>{errorMessage}</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Generador;
