import React from 'react';

const OpcionBusqueda = ({ index, filter, term, onFilterChange, onTermChange, onRemove }) => {
    const categorias = [
        'Vegetariano', 'Vegano', 'Desayuno', 'Sin TACC', 'Sin gluten', 
        'Postres', 'Saludables', 'Cenas', 'Almuerzos', 'Platos principales', 
        'Aperitivos', 'Bebidas', 'Dulces', 'Ensaladas', 'Sopas y cremas'
    ];
    const dificultades = ['Fácil', 'Media', 'Difícil'];

    return (
        <div className="flex space-x-2 mb-4">
            <select
                value={filter}
                onChange={(e) => onFilterChange(index, e.target.value)}
                className="border border-gray-300 rounded-lg px-2 py-2 w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="titulo">Por Título</option>
                <option value="id_categoria">Por Categorías</option>
                <option value="dificultad">Por Dificultad</option>
                <option value="creador">Por Creador (nombre de usuario)</option>
                <option value="usuario">Buscar Usuario</option>
            </select>

            {filter === 'id_categoria' ? (
                <select
                    value={term}
                    onChange={(e) => onTermChange(index, e.target.value)}
                    className="border border-gray-300 rounded-lg px-2 py-2 w-48 focus:outline-none focus:ring-2 focus:ring-blue-500" // Mismo tamaño que el primer select
                    required
                >
                    <option value="">Selecciona una categoría</option>
                    {categorias.map((categoria, i) => (
                        <option key={i} value={i + 1}>{categoria}</option>
                    ))}
                </select>
            ) : filter === 'dificultad' ? (
                <select
                    value={term}
                    onChange={(e) => onTermChange(index, e.target.value)}
                    className="border border-gray-300 rounded-lg px-2 py-2 w-48 focus:outline-none focus:ring-2 focus:ring-blue-500" // Mismo tamaño que el primer select
                    required
                >
                    <option value="">Selecciona una dificultad</option>
                    {dificultades.map((dificultad, i) => (
                        <option key={i} value={dificultad}>{dificultad}</option>
                    ))}
                </select>
            ) : (
                <input
                    type="text"
                    value={term}
                    onChange={(e) => onTermChange(index, e.target.value)}
                    placeholder="Escribe el término"
                    className="border border-gray-300 rounded-lg px-2 py-2 w-48 focus:outline-none focus:ring-2 focus:ring-blue-500" // Mismo tamaño que el primer select
                    required
                />
            )}

            <button
                type="button"
                onClick={() => onRemove(index)}
                className="bg-red-500 text-white px-3 py-1 rounded-lg"
                disabled={index === 0} // Deshabilitar si es el primer elemento para que siempre quede uno
            >
                -
            </button>
        </div>
    );
};

export default OpcionBusqueda;
