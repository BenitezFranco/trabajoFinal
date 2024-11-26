import React, { useEffect, useState } from "react";
import Select from "react-select";

const OpcionBusqueda = ({
  index,
  filter,
  term,
  onFilterChange,
  onTermChange,
  onRemove,
}) => {
  const [ingredientes, setIngredientes] = useState([]);
  const categorias = [
    { value: "1", label: "Vegetariano" },
    { value: "2", label: "Vegano" },
    { value: "3", label: "Desayuno" },
    { value: "4", label: "Sin TACC" },
    { value: "5", label: "Sin gluten" },
    { value: "6", label: "Postres" },
    { value: "7", label: "Saludables" },
    { value: "8", label: "Cenas" },
    { value: "9", label: "Almuerzos" },
    { value: "10", label: "Platos principales" },
    { value: "11", label: "Aperitivos" },
    { value: "12", label: "Bebidas" },
    { value: "13", label: "Dulces" },
    { value: "14", label: "Ensaladas" },
    { value: "15", label: "Sopas y cremas" },
  ];

  const dificultades = [
    { value: "Fácil", label: "Fácil" },
    { value: "Media", label: "Media" },
    { value: "Difícil", label: "Difícil" },
  ];

  useEffect(() => {
    // Llamada a la API para obtener ingredientes
    const fetchIngredientes = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/ingredientes");
        if (response.status === 200) {
          const ingredientes = await response.json();
          const options = ingredientes.map((ingrediente) => ({
            value: ingrediente.id_ingrediente,
            label: ingrediente.nombre,
          }));
          setIngredientes(options);
        } else if (response.status === 401 || response.status === 403) {
          alert("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
          localStorage.removeItem("token");
          router.push("/login");
        }
      } catch (error) {
        console.error("Error al obtener ingredientes:", error);
      }
    };

    fetchIngredientes();
  }, []);

  const handleTermChange = (selectedOption) => {
    // Si se selecciona una opción, actualiza el término con el valor de la opción
    onTermChange(index, selectedOption ? selectedOption.value : "");
  };

  return (
    <div className="flex space-x-2 mb-4">
      <select id='filtros'
        value={filter} // Este valor debe estar sincronizado con el estado
        onChange={(e) => onFilterChange(index, e.target.value)}
        className="border border-gray-300 rounded-lg px-2 py-2 w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="titulo">Por Título</option>
        <option value="id_categoria">Por Categoría</option>
        <option value="dificultad">Por Dificultad</option>
        <option value="id_ingrediente">Por Ingrediente</option>
        <option value="creador">Por Creador (nombre de usuario)</option>
      </select>

      {filter === "id_categoria" ? (
        <Select
          value={term ? categorias.find((cat) => cat.value === term) : null}
          onChange={handleTermChange}
          options={categorias}
          placeholder="Selecciona una categoría"
          className="w-48"
          isClearable
        />
      ) : filter === "dificultad" ? (
        <Select
          value={term ? dificultades.find((dif) => dif.value === term) : null}
          onChange={handleTermChange}
          options={dificultades}
          placeholder="Selecciona una dificultad"
          className="w-48"
          isClearable
        />
      ) : filter === "id_ingrediente" ? (
        <Select
          value={term ? ingredientes.find((dif) => dif.value === term) : null}
          onChange={handleTermChange}
          options={ingredientes}
          placeholder="Selecciona un ingrediente"
          className="w-48"
          isClearable
        />
      ) : (
        <input
          type="text"
          value={term}
          onChange={(e) => onTermChange(index, e.target.value)}
          placeholder="Escribe el término"
          className="border border-gray-300 rounded-lg px-2 py-2 w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      )}
      {/* Botón de eliminar solo si no es el primer filtro */}
      {index > 0 && (
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="bg-red-500 text-white rounded-full p-2 transition-all duration-300 transform hover:bg-red-600 hover:scale-105 focus:outline-none"
          aria-label="Eliminar filtro"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default OpcionBusqueda;
