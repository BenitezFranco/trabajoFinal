const sequelize = require('./config/dbConfig'); // Importa la conexión a la base de datos
const CalendarioSemanal_Receta=require('./models/CalendarioSemanal_Receta');
const CalendarioSemanal =require('./models/CalendarioSemanal');
const Calificacion=require('./models/Calificacion');
const Categoria=require('./models/Categoria');
const Comentario=require('./models/Comentario');
const Favorito=require('./models/Favorito');
const Receta_Categoria=require('./models/Receta_Categoria');
const Receta= require('./models/Receta');
const Seguimiento=require('./models/Seguimiento');
const Usuario=require('./models/Usuario');
const Ingrediente = require('./models/Ingrediente');
const Receta_Ingrediente=require('./models/Receta_Ingrediente');


const insertIngredientes = async () => {
    const ingredientes = [
        { nombre: 'Tomate' }, { nombre: 'Cebolla' }, { nombre: 'Pimiento rojo' }, { nombre: 'Pimiento verde' },
        { nombre: 'Zanahoria' }, { nombre: 'Espinaca' }, { nombre: 'Ajo' }, { nombre: 'Jengibre' },
        { nombre: 'Apio' }, { nombre: 'Calabacín' }, { nombre: 'Papa' }, { nombre: 'Berenjena' },
        { nombre: 'Champiñones' }, { nombre: 'Perejil' }, { nombre: 'Albahaca' }, { nombre: 'Orégano' },
        { nombre: 'Romero' }, { nombre: 'Tomillo' }, { nombre: 'Lechuga' }, { nombre: 'Pepino' },
        { nombre: 'Rúcula' }, { nombre: 'Puerro' }, { nombre: 'Cilantro' }, { nombre: 'Menta' },
        { nombre: 'Chícharos' }, { nombre: 'Maíz' }, { nombre: 'Brócoli' }, { nombre: 'Coliflor' },
        { nombre: 'Huevo' }, { nombre: 'Queso' }, { nombre: 'Pollo' }, { nombre: 'Carne de res' },
        { nombre: 'Cerdo' }, { nombre: 'Tofu' }, { nombre: 'Lentejas' }, { nombre: 'Frijoles' },
        { nombre: 'Arroz' }, { nombre: 'Pasta' }, { nombre: 'Harina' }, { nombre: 'Azúcar' },
        { nombre: 'Sal' }, { nombre: 'Pimienta' }, { nombre: 'Canela' }, { nombre: 'Nuez moscada' },
        { nombre: 'Clavo de olor' }, { nombre: 'Comino' }, { nombre: 'Paprika' }, { nombre: 'Curry' },
        { nombre: 'Mostaza' }, { nombre: 'Ketchup' }, { nombre: 'Salsa de soja' }, { nombre: 'Vinagre' },
        { nombre: 'Aceite de oliva' }, { nombre: 'Mantequilla' }, { nombre: 'Leche' }, { nombre: 'Yogur' },
        { nombre: 'Crema de leche' }, { nombre: 'Queso parmesano' }, { nombre: 'Queso cheddar' }, { nombre: 'Nata' },
        { nombre: 'Miel' }, { nombre: 'Limón' }, { nombre: 'Lima' }, { nombre: 'Manzana' },
        { nombre: 'Plátano' }, { nombre: 'Naranja' }, { nombre: 'Uvas' }, { nombre: 'Piña' },
        { nombre: 'Mango' }, { nombre: 'Papaya' }, { nombre: 'Sandía' }, { nombre: 'Melón' },
        { nombre: 'Frambuesa' }, { nombre: 'Fresa' }, { nombre: 'Arándano' }, { nombre: 'Mora' },
        { nombre: 'Cereza' }, { nombre: 'Durazno' }, { nombre: 'Albaricoque' }, { nombre: 'Ciruela' },
        { nombre: 'Granada' }, { nombre: 'Kiwi' }, { nombre: 'Pera' }, { nombre: 'Coco' },
        { nombre: 'Higo' }, { nombre: 'Almendra' }, { nombre: 'Nuez' }, { nombre: 'Castaña' },
        { nombre: 'Avellana' }, { nombre: 'Pistacho' }, { nombre: 'Semillas de calabaza' }, { nombre: 'Chía' },
        { nombre: 'Quinoa' }, { nombre: 'Avena' }, { nombre: 'Cebada' }, { nombre: 'Centeno' },
        { nombre: 'Pan rallado' }, { nombre: 'Pan' }, { nombre: 'Masa de pizza' }, { nombre: 'Harina de maíz' },
        { nombre: 'Aceitunas' }, { nombre: 'Pepinillos' }, { nombre: 'Anchoas' }, { nombre: 'Salmón' },
        { nombre: 'Atún' }, { nombre: 'Camarones' }, { nombre: 'Langostinos' }, { nombre: 'Calamar' },
        { nombre: 'Pulpo' }, { nombre: 'Trucha' }, { nombre: 'Merluza' }, { nombre: 'Bacalao' },
        { nombre: 'Almejas' }, { nombre: 'Mejillones' }, { nombre: 'Carne de cordero' }, { nombre: 'Carne de pato' },
        { nombre: 'Carne de pavo' }, { nombre: 'Caldo de pollo' }, { nombre: 'Caldo de verduras' }, { nombre: 'Caldo de carne' },
        { nombre: 'Garbanzos' }, { nombre: 'Judías verdes' }, { nombre: 'Habichuelas' }, { nombre: 'Espaguetis' },
        { nombre: 'Macarrones' }, { nombre: 'Fideos' }, { nombre: 'Salsa de tomate' }, { nombre: 'Puré de papas' },
        { nombre: 'Patata dulce' }, { nombre: 'Yuca' }, { nombre: 'Plátano macho' }, { nombre: 'Aceite de coco' },
        { nombre: 'Sésamo' }, { nombre: 'Azúcar moreno' }, { nombre: 'Azúcar glas' }, { nombre: 'Levadura' },
        { nombre: 'Bicarbonato de sodio' }, { nombre: 'Maicena' }, { nombre: 'Leche de almendra' }, { nombre: 'Leche de coco' },
        { nombre: 'Leche de soja' }, { nombre: 'Leche de avena' }, { nombre: 'Huevo de codorniz' }, { nombre: 'Huevo de pato' },
        { nombre: 'Cebolla en polvo' }, { nombre: 'Ajo en polvo' }, { nombre: 'Cilantro en polvo' }, { nombre: 'Hojas de laurel' },
        { nombre: 'Semillas de lino' }, { nombre: 'Goma xantana' }, { nombre: 'Aguacate' }, { nombre: 'Pimienta de cayena' },
        { nombre: 'Pimienta negra' }, { nombre: 'Pimienta blanca' }, { nombre: 'Pimienta rosa' }, { nombre: 'Chile' },
        { nombre: 'Salsa tabasco' }, { nombre: 'Salsa barbecue' }, { nombre: 'Salsa sriracha' }, { nombre: 'Salsa teriyaki' },
        { nombre: 'Jalapeño' }, { nombre: 'Wasabi' }, { nombre: 'Alga nori' }, { nombre: 'Sésamo negro' },
        { nombre: 'Sésamo blanco' }, { nombre: 'Aceite de sésamo' }, { nombre: 'Vinagre de arroz' }, { nombre: 'Pan pita' },
        { nombre: 'Tortilla de maíz' }, { nombre: 'Tortilla de trigo' }, { nombre: 'Nata para montar' }, { nombre: 'Manteca' },
        { nombre: 'Crema agria' }, { nombre: 'Queso azul' }, { nombre: 'Queso feta' }, { nombre: 'Queso brie' },
        { nombre: 'Queso gouda' }, { nombre: 'Queso mozzarella' }, { nombre: 'Queso camembert' }, { nombre: 'Queso ricota' },
        { nombre: 'Yogur griego' }, { nombre: 'Salsa de yogur' }, { nombre: 'Curry en polvo' }, { nombre: 'Masala' },
        { nombre: 'Semillas de mostaza' }, { nombre: 'Aceite de canola' }, { nombre: 'Aceite de girasol' }, { nombre: 'Aceite de palma' },
        { nombre: 'Aceite de maíz' }, { nombre: 'Albahaca fresca' }, { nombre: 'Estragón' }, { nombre: 'Eneldo' },
        { nombre: 'Hojas de menta' }, { nombre: 'Raíz de apio' }, { nombre: 'Cebolla morada' }, { nombre: 'Cebolla verde' },
        { nombre: 'Calabaza' }, { nombre: 'Kale' }, { nombre: 'Berza' }, { nombre: 'Raíz de jengibre' },
        { nombre: 'Yogur de coco' }, { nombre: 'Leche de cabra' }, { nombre: 'Leche condensada' }, { nombre: 'Leche evaporada' },
        { nombre: 'Chocolate negro' }, { nombre: 'Chocolatecon leche' }, { nombre: 'Chocolate blanco' }, { nombre: 'Cacao en polvo' },
        { nombre: 'Gelatina' }, { nombre: 'Pasta de curry' }, { nombre: 'Castañas de cajú' }, { nombre: 'Pasta de sésamo' }, 
        { nombre: 'Tahini' }, { nombre: 'Masa de empanada' }, { nombre: 'Masa de crepas' }, { nombre: 'Galletas' }, 
        { nombre: 'Galletas de jengibre' }, { nombre: 'Té' }, { nombre: 'Café' }, { nombre: 'Batido' }, 
        { nombre: 'Nutella' }, { nombre: 'Jalea' }, { nombre: 'Mermelada' }, { nombre: 'Compota' },
        { nombre: 'Frutos secos' }, { nombre: 'Choclo' }, { nombre: 'Palomitas de maíz' }, { nombre: 'Cereal' }, 
        { nombre: 'Grosella' }, { nombre: 'Pera al horno' }, { nombre: 'Zumo de naranja' }, { nombre: 'Zumo de manzana' },
        { nombre: 'Zumo de uva' }, { nombre: 'Zumo de piña' }, { nombre: 'Zumo de limón' }, { nombre: 'Batido de proteínas' }, 
        { nombre: 'Sorbete' }, { nombre: 'Helado' }, { nombre: 'Masa de pan' }, { nombre: 'Galletas saladas' },
        { nombre: 'Pasta de almendra' }, { nombre: 'Ramen' }, { nombre: 'Tortellini' }, { nombre: 'Fideos udon' }, 
        { nombre: 'Bulgur' },{ nombre: 'Cuscús' }, { nombre: 'Kasha' }, { nombre: 'Tapioca' }, 
        { nombre: 'Chips de tortilla' }, { nombre: 'Pasta de tomate' }, { nombre: 'Curry verde' }, { nombre: 'Curry rojo' }, 
        { nombre: 'Curry amarillo' }, { nombre: 'Cebolla caramelizada' }, { nombre: 'Frijoles negros' }, { nombre: 'Frijoles rojos' },
        { nombre: 'Frijoles pintos' }, { nombre: 'Frijoles de soya' }, { nombre: 'Frijoles adzuki' }, { nombre: 'Guacamole' }, 
        { nombre: 'Pesto' }, { nombre: 'Salsa de maní' }, { nombre: 'Chili' }, { nombre: 'Salsa de chile' }, 
        { nombre: 'Mantequilla de maní' }, { nombre: 'Aceitunas negras' }, { nombre: 'Aceitunas verdes' }, { nombre: 'Bebida energética' }, 
        { nombre: 'Bebida isotónica' }, { nombre: 'Bebida de frutas' }, { nombre: 'Bebida de leche' }, { nombre: 'Jugo detox' }, 
        { nombre: 'Infusión' }, { nombre: 'Té helado' }, { nombre: 'Cerveza' }, { nombre: 'Vino' }, 
        { nombre: 'Sidra' }, { nombre: 'Licores' }, { nombre: 'Bebidas alcohólicas' }, { nombre: 'Bebidas sin alcohol' }, 
        { nombre: 'Smoothie de frutas' }, { nombre: 'Batido de verduras' },{ nombre: 'Sangría' }, { nombre: 'Margarita' }, { nombre: 'Mojito' },
        { nombre: 'Piña colada' }, { nombre: 'Cuba libre' }, { nombre: 'Bloody Mary' },{ nombre: 'Daiquiri' }, 
        { nombre: 'Whisky' }, { nombre: 'Ron' },{ nombre: 'Vodka' }, { nombre: 'Ginebra' }, 
        { nombre: 'Tequila' },{ nombre: 'Agua' },];

        try {
            for (const ingrediente of ingredientes) {
                await Ingrediente.findOrCreate({
                    where: { nombre: ingrediente.nombre },
                    defaults: { nombre: ingrediente.nombre }
                });
            }
            console.log('Ingredientes verificados y creados si no existían');
        } catch (error) {
            console.error('Error al verificar o crear ingredientes:', error);
        }
    };

const insertUsuario = async () => {
    const usuarios = [
        {
            nombre: 'Franco',
            correo_electronico: 'franco@franco.com',
            contrasena: 'franco123',
        },
    ];

    try {
        for (const usuario of usuarios) {
            await Usuario.findOrCreate({
                where: { correo_electronico: usuario.correo_electronico }, 
                defaults: { 
                    nombre: usuario.nombre,
                    contrasena: usuario.contrasena,
                }
            });
        }
        console.log('Usuarios verificados y creados si no existían');
    } catch (error) {
        console.error('Error al verificar o crear usuarios:', error);
    }
};

const insertCategoria = async () => {
    const categorias = [
        { nombre: 'Vegetariano' },
        { nombre: 'Vegano' },
        { nombre: 'Desayuno' },
        { nombre: 'Sin TACC' },
        { nombre: 'Sin gluten' },
        { nombre: 'Postres' },
        { nombre: 'Saludables' },
        { nombre: 'Cenas' },
        { nombre: 'Almuerzos' },
        { nombre: 'Platos principales' },
        { nombre: 'Aperitivos' },
        { nombre: 'Bebidas' },
        { nombre: 'Dulces' },
        { nombre: 'Ensaladas' },
        { nombre: 'Sopas y cremas' },
    ];

    try {
        for (const categoria of categorias) {
            await Categoria.findOrCreate({
                where: { nombre: categoria.nombre },
                defaults: { nombre: categoria.nombre }
            });
        }
        console.log('Categorías verificadas y creadas si no existían');
    } catch (error) {
        console.error('Error al verificar o crear categorías:', error);
    }                        
}

// Función para sincronizar la base de datos
const syncDatabase = async () => {
    try {
        await sequelize.sync({ alter: true }); // Usa force: true solo si deseas reiniciar la base de datos

        await insertUsuario(); // Inserta usuarios
        await insertCategoria(); // Inserta categorías
        await insertIngredientes();//Inserta Ingredientes
       console.log('Base de datos sincronizada correctamente.');
    } catch (error) {
        console.error('Error al sincronizar la base de datos:', error);
    }
};

module.exports = syncDatabase;