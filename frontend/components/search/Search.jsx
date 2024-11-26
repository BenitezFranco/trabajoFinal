import { useState } from "react";
import Link from "next/link";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import SearchGrid from "./SearchGrid";
import OpcionBusqueda from "./opcionBusqueda/OpcionBusqueda";

const Search = () => {
  const [opcionesBusqueda, setOpcionesBusqueda] = useState([
    { filter: "titulo", term: "" },
  ]);
  const [results, setResults] = useState([]);
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [modoBusqueda, setModoBusqueda] = useState("receta");
  const [usuarioTerm, setUsuarioTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchSubmitted(true);
    setResults([]);

    if (modoBusqueda === "usuario" && usuarioTerm.trim() === "") {
      setErrorMessage("Por favor, ingresa un nombre de usuario para buscar.");
      return;
    }

    setErrorMessage("");

    try {
      let searchQueries = "";

      if (modoBusqueda === "receta") {
        searchQueries = opcionesBusqueda
          .map((opcion) => `${opcion.filter}=${opcion.term}`)
          .join("&");
      } else if (modoBusqueda === "usuario") {
        searchQueries = `usuario=${usuarioTerm}`;
      }

      const response = await fetch(
        `http://localhost:3000/search?${searchQueries}`
      );
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Error al realizar la búsqueda:", error);
    }
  };

  const handleModoBusquedaChange = (modo) => {
    setModoBusqueda(modo);
    setOpcionesBusqueda([{ filter: "titulo", term: "" }]);
    setUsuarioTerm("");
    setSearchSubmitted(false);
    setErrorMessage("");
  };

  const handleAddOption = () => {
    setOpcionesBusqueda([
      ...opcionesBusqueda,
      { filter: "id_categoria", term: "" },
    ]);
  };

  const handleRemoveOption = (index) => {
    const newOptions = opcionesBusqueda.filter((_, i) => i !== index);
    setOpcionesBusqueda(newOptions);
  };

  const handleFilterChange = (index, newFilter) => {
    setOpcionesBusqueda((prevOpciones) =>
      prevOpciones.map((opcion, i) =>
        i === index ? { ...opcion, filter: newFilter, term: "" } : opcion
      )
    );
  };

  const handleTermChange = (index, newTerm) => {
    const newOptions = [...opcionesBusqueda];
    newOptions[index].term = newTerm;
    setOpcionesBusqueda(newOptions);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow bg-gray-100 p-6" role="main">
        <div className="grid grid-cols-7 grid-rows-4 gap-6 max-w-6xl mx-auto">
          {/* Sección de Búsqueda */}
          <div className="col-span-3 row-span-4 bg-white p-6 rounded-xl shadow-lg">
            <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
              Buscar Recetas o Usuarios
            </h1>

            {/* Selector de modo de búsqueda */}
            <div className="flex justify-center space-x-4 mb-6">
              <button
                onClick={() => handleModoBusquedaChange("receta")}
                className={`py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105 ${
                  modoBusqueda === "receta"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-300 text-gray-800"
                }`}
              >
                Buscar por Receta
              </button>
              <button
                onClick={() => handleModoBusquedaChange("usuario")}
                className={`py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105 ${
                  modoBusqueda === "usuario"
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-gray-300 text-gray-800"
                }`}
              >
                Buscar por Usuario
              </button>
            </div>

            {/* Formulario de búsqueda */}
            <form onSubmit={handleSearch} className="mb-6">
              <div className="flex flex-col space-y-4">
                {modoBusqueda === "receta" ? (
                  <>
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
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      placeholder="Buscar por nombre de usuario"
                      value={usuarioTerm}
                      onChange={(e) => setUsuarioTerm(e.target.value)}
                      className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 transform hover:scale-105"
                    />
                    {errorMessage && (
                      <p className="text-red-500 text-sm mt-1">
                        {errorMessage}
                      </p>
                    )}
                  </>
                )}

                <button
                  type="submit" // Cambié de type="button" a type="submit"
                  className="bg-transparent text-gray-700 font-semibold border-2 border-gray-700 rounded-full py-2 px-6 mt-4 hover:bg-gray-200 focus:outline-none transition duration-300 transform hover:scale-105"
                >
                  Buscar
                </button>
              </div>
            </form>
          </div>

          {/* Sección de Resultados */}
          <div className="col-span-5 row-span-4 col-start-4 bg-white p-6 rounded-xl shadow-lg">
            {searchSubmitted && results.length > 0 ? (
              <SearchGrid results={results} />
            ) : searchSubmitted && results.length === 0 ? (
              <p className="text-gray-500 text-center">
                No se encontraron resultados
              </p>
            ) : null}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Search;
