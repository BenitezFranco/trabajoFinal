// models/initModels.js
const Usuario = require('./Usuario');
const Receta = require('./Receta');
const Categoria = require('./Categoria');
const Receta_Categoria = require('./Receta_Categoria');

// Definir asociaciones
const initModels = () => {
    // Asociación de Receta con Usuario
    Receta.belongsTo(Usuario, { foreignKey: 'id_usuario' });

    // Asociación de Categoria con Receta a través de Receta_Categoria (muchos a muchos)
    Categoria.belongsToMany(Receta, {
        through: Receta_Categoria,
        foreignKey: 'id_categoria',
        otherKey: 'id_receta',
        as: 'recetas' // Alias para esta asociación
    });

    // Asociación inversa (opcional, pero recomendable)
    Receta.belongsToMany(Categoria, {
        through: Receta_Categoria,
        foreignKey: 'id_receta',
        otherKey: 'id_categoria',
        as: 'categorias' // Alias para esta asociación
    });
};

// Exportar la función para que pueda ser llamada en otro lugar
module.exports = initModels;
