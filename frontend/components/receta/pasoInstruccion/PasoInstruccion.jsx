import { useState } from 'react';

const PasoInstruccion = ({ index, handlePasoChange, handleImagenChange, paso }) => {
    return (
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
                Paso {index + 1}:
            </label>
            <input
                type="text"
                name={`paso-${index}`}
                value={paso.paso}
                onChange={(e) => handlePasoChange(index, e.target.value)}
                placeholder="Descripción del paso"
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <input
                type="file"
                name={`imagen-${index}`}
                accept="image/*"
                onChange={(e) => handleImagenChange(index, e.target.files[0])}
                className="mt-2"
            />
        </div>
    );
};

export default PasoInstruccion;
