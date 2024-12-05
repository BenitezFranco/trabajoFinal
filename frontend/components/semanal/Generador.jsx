import { useState } from "react";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import SearchGrid from "../search/SearchGrid";
import OpcionBusqueda from "../search/opcionBusqueda/OpcionBusqueda";
import { useRouter } from "next/router"; // Asegúrate de importar useRouter

const Generador = () => {
  const router = useRouter(); // Inicializamos el router
  const [opcionesBusqueda, setOpcionesBusqueda] = useState([
    { filter: "titulo", term: "" },
  ]);
  const [results, setResults] = useState([]);
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Estado para el mensaje de éxito
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [recipeCount, setRecipeCount] = useState(7);
  const [calendarName, setCalendarName] = useState(""); // Estado para el nombre del plan
  const [fecha, setFecha] = useState(""); // Estado para la fecha seleccionada


  // Función para seleccionar aleatoriamente los resultados
  const getRandomResults = (results) => {
    const shuffled = [...results]; // Copiar el array original
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Seleccionar un índice aleatorio
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Intercambiar los elementos
    }

    // Si hay menos resultados de los solicitados, repetir hasta completar
    const randomResults = [];
    while (randomResults.length < recipeCount && shuffled.length > 0) {
      randomResults.push(...shuffled);
    }

    // Retornar solo la cantidad de recetas solicitadas
    return randomResults.slice(0, recipeCount);
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

      const response = await fetch(
        `http://localhost:3000/search?${searchQueries}`
      );
      const data = await response.json();

      // Filtrar aleatoriamente los resultados y asegurarnos de que haya 7
      const randomResults = getRandomResults(data);
      console.log(data);
      setResults(randomResults);
    } catch (error) {
      console.error("Error al realizar la búsqueda:", error);
      setErrorMessage("Error al realizar la búsqueda");
    }
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

  // Nueva función para manejar la creación del calendario
  const handleCrearCalendario = async () => {
    if (!calendarName || !fecha) {
      setErrorMessage("Por favor, ingresa un nombre para el plan y selecciona una fecha.");
      return;
    }
  
    setIsButtonDisabled(true); // Deshabilita el botón al iniciar la acción
    const token = localStorage.getItem("token");
    try {
      const idsRecetas = results.map((receta) => receta.id_receta);
      const response = await fetch("http://localhost:3000/crearCalendario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ idsRecetas, name: calendarName, fecha }), // Incluimos la fecha
      });
      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor");
      }
      const data = await response.json();
      console.log("Plan creado:", data);
  
      setSuccessMessage("Plan creado con éxito!");
  
      // Redirigir después de 2 segundos
      setTimeout(() => {
        router.push("http://localhost:3001/plan-recetas");
      }, 2000);
    } catch (error) {
      console.error("Error al crear el plan:", error);
      setErrorMessage("Error al crear el plan");
      setIsButtonDisabled(false); // Reactiva el botón si hay un error
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
            <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
              Buscar Recetas
            </h1>

            {/* Formulario de búsqueda */}
            <form onSubmit={handleSearch} className="mb-6">
              <div className="flex flex-col space-y-4">
              <label for="filtros" className="text-gray-700 font-medium">
                      Filtrar por:
                    </label>
                {opcionesBusqueda.map((opcion, index) => (
                  <>
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
                <label htmlFor="fecha" className="text-gray-700 font-medium">
  Fecha:
</label>
<input
  id="fecha"
  type="date"
  value={fecha}
  onChange={(e) => setFecha(e.target.value)}
  className="border border-gray-300 rounded-lg p-2 w-full mt-2"
  min={new Date().toISOString().split('T')[0]}
/>

                <label className="text-gray-700 font-medium">
                  Cantidad de dias:
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={recipeCount}
                    onChange={(e) => {
                      const value = parseInt(e.target.value, 10) || 1;

                      // Validar límites
                      if (value < 1) {
                        setRecipeCount(1);
                      } else if (value > 31) {
                        setRecipeCount(31);
                      } else {
                        setRecipeCount(value);
                      }
                    }}
                    className="border border-gray-300 rounded-lg p-2 ml-2"
                  />
                </label>

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
                  Plan Aleatorio
                </button>
              </div>
            </form>
          </div>

          {/* Sección de Resultados */}
          <div className="col-span-5 row-span-4 col-start-4 bg-white p-6 rounded-xl shadow-lg">
            {searchSubmitted && results.length > 0 ? (
              <div>
                <div className="mt-4">
                  <label htmlFor="calendarName" className="text-gray-700 font-medium">
                    Nombre del Plan:
                  </label>
                  <input
                    id="calendarName"
                    type="text"
                    value={calendarName}
                    onChange={(e) => setCalendarName(e.target.value)}
                    className="border border-gray-300 rounded-lg p-2 w-full mt-2"
                    placeholder="Ingresa un nombre para el plan"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleCrearCalendario}
                  disabled={isButtonDisabled}
                  className={`bg-transparent text-gray-700 font-semibold border-2 border-gray-700 rounded-full py-2 px-6 mt-4 focus:outline-none transition duration-300 transform ${
                    isButtonDisabled
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-200"
                  }`}
                >
                  {isButtonDisabled ? "Creando..." : "Crear plan"}
                </button>
                {errorMessage && (
                  <p className="text-red-500 mt-4">{errorMessage}</p>
                )}
                {successMessage && (
                  <p className="text-green-500 mt-4">{successMessage}</p>
                )}
                <SearchGrid results={results} />
              </div>
            ) : searchSubmitted && results.length === 0 ?  (
              <p className="text-center text-gray-700">
                No se encontraron recetas o no se ha realizado la búsqueda aún.
              </p>
            ):null}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Generador;
