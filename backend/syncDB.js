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


const recetas = [
    {
        titulo: "Ensalada César",
        foto_receta: "https://pixabay.com/es/images/download/salad-2629262_640.jpg",
        descripcion: "Una clásica ensalada César con pollo a la parrilla.",
        instrucciones: [
                {"paso":"Cocinar el pollo a la parrilla y cortarlo en tiras.", "imagen": null}
                ,
                {"paso":"Mezclar la lechuga romana con el aderezo César.", "imagen": null}
                ,
                {"paso":"Agregar crutones y el pollo.", "imagen": null}
                ,
                {"paso":"Espolvorear con queso parmesano.", "imagen": null}
                
            ],
        dificultad: "Fácil",
        tiempo_preparacion: 20,
        id_usuario: 1
    },
    {
        titulo: "Tarta de manzana",
        foto_receta: "https://pixabay.com/es/images/download/apple-pie-1071747_640.jpg",
        descripcion: "Una deliciosa tarta de manzana con masa casera.",
        instrucciones:[
                {"paso":"Precalentar el horno a 180°C.", "imagen": null}
                ,
                {"paso":"Hacer la masa y forrar un molde.", "imagen": null}
                ,
                {"paso":"Mezclar las manzanas con azúcar y canela.", "imagen": null}
                ,
                {"paso":"Verter las manzanas en la masa y hornear por 45 minutos.", "imagen": null}
            ],
        dificultad: "Media",
        tiempo_preparacion: 60,
        id_usuario: 1
    },
    {
        titulo: "Pasta al pesto",
        foto_receta: "https://pixabay.com/es/images/download/pasta-1033216_640.jpg",
        descripcion: "Pasta fresca con salsa de pesto casera.",
        instrucciones:[
                {"paso":"Cocinar la pasta según las instrucciones del paquete.", "imagen": null}
                ,
                {"paso":"Mezclar albahaca, piñones, ajo y aceite de oliva para hacer el pesto.", "imagen": null}
                ,
                {"paso":"Combinar la pasta con el pesto y servir.", "imagen": null}
                
            ],
        dificultad: "Fácil",
        tiempo_preparacion: 30,
        id_usuario: 1
    },
    {
        titulo: "Sopa de tomate",
        foto_receta: "https://pixabay.com/es/images/download/tomatoes-1822185_640.jpg",
        descripcion: "Sopa de tomate cremosa, ideal para el invierno.",
        instrucciones:[
                {"paso":"Saltear cebolla y ajo en una olla.", "imagen": null}
                ,
                {"paso":"Agregar tomates y caldo de verduras.", "imagen": null}
                ,
                {"paso":"Cocinar a fuego lento y mezclar hasta obtener una crema.", "imagen": null}
                
            ],
        dificultad: "Fácil",
        tiempo_preparacion: 40,
        id_usuario: 1
    },
    {
        titulo: "Tacos de pollo",
        foto_receta: "https://pixabay.com/es/images/download/tacos-4511272_640.jpg",
        descripcion: "Tacos rellenos de pollo marinado y vegetales.",
        instrucciones:[
                {"paso":"Marinar el pollo y cocinarlo en la parrilla.", "imagen": null}
                ,
                {"paso":"Calentar las tortillas y rellenarlas con pollo.", "imagen": null}
                ,
                {"paso":"Agregar cebolla, cilantro y salsa.", "imagen": null}
                
            ],
        dificultad: "Media",
        tiempo_preparacion: 25,
        id_usuario: 1
    },
    {
        titulo: "Brownies de chocolate",
        foto_receta: "https://pixabay.com/es/images/download/chocolate-brownies-668624_640.jpg",
        descripcion: "Deliciosos brownies de chocolate oscuro.",
        instrucciones:[
                {"paso":"Precalentar el horno a 180°C.", "imagen": null}
                ,
                {"paso":"Derretir chocolate y mantequilla.", "imagen": null}
                ,
                {"paso":"Mezclar con azúcar, huevos y harina.", "imagen": null}
                ,
                {"paso":"Hornear por 25 minutos.", "imagen": null}
                
            ],
        dificultad: "Fácil",
        tiempo_preparacion: 45,
        id_usuario: 1
    },
    {
        titulo: "Quiche de espinacas",
        foto_receta: "https://pixabay.com/es/images/download/quiche-2468840_640.jpg",
        descripcion: "Quiche saludable de espinacas y queso.",
        instrucciones: [
                {"paso":"Precalentar el horno a 180°C.", "imagen": null}
                ,
                {"paso":"Mezclar huevos, crema y espinacas.", "imagen": null}
                ,
                {"paso":"Verter en una base de masa y hornear por 30 minutos.", "imagen": null}
                
            ],
        dificultad: "Media",
        tiempo_preparacion: 50,
        id_usuario: 1
    },
    {
        titulo: "Smoothie de frutas",
        foto_receta: "https://pixabay.com/es/images/download/fruit-3222313_640.jpg",
        descripcion: "Un refrescante smoothie de frutas tropicales.",
        instrucciones: [
                {"paso":"Mezclar plátano, mango y leche en una licuadora.", "imagen": null}
                ,
                {"paso":"Servir frío con hielo.", "imagen": null}
            ],
        dificultad: "Fácil",
        tiempo_preparacion: 10,
        id_usuario: 1
    },
    {
        titulo: "Pancakes",
        foto_receta: "https://pixabay.com/es/images/download/pancakes-4882706_640.jpg",
        descripcion: "Esponjosos pancakes para el desayuno.",
        instrucciones: [
                {"paso":"Mezclar harina, huevo, leche y polvo de hornear.", "imagen": null},
                ,
                {"paso":"Cocinar en una sartén caliente y servir con sirope.", "imagen": null},
                
            ],
        dificultad: "Fácil",
        tiempo_preparacion: 20,
        id_usuario: 1
    },
    {
        titulo: "Guiso de lentejas",
        foto_receta: "https://pixabay.com/es/images/download/stew-3393172_640.jpg",
        descripcion: "Nutritivo guiso de lentejas y vegetales.",
        instrucciones: [
                {"paso":"Cocinar cebolla, zanahoria y apio.", "imagen": null},
                {"paso":"Agregar lentejas y caldo, y cocinar a fuego lento.", "imagen": null},
                {"paso":"Servir caliente.", "imagen": null}
                
            ],
        dificultad: "Media",
        tiempo_preparacion: 60,
        id_usuario: 1
    },
    {
        titulo: "Pizza Margherita",
        foto_receta: "https://pixabay.com/es/images/download/pizza-5275191_640.jpg",
        descripcion: "Pizza clásica con tomate, mozzarella y albahaca.",
        instrucciones: [
                {"paso":"Preparar la masa y extenderla.", "imagen": null},
                {"paso":"Cubrir con salsa de tomate, mozzarella y albahaca.", "imagen": null},
                {"paso":"Hornear a alta temperatura.", "imagen": null}
            ],
        dificultad: "Difícil",
        tiempo_preparacion: 90,
        id_usuario: 1
    },
    {
        titulo: "Muffins de arándano",
        foto_receta: "https://pixabay.com/es/images/download/muffins-4002553_640.jpg",
        descripcion: "Muffins suaves y esponjosos con arándanos.",
        instrucciones: [{"paso":"Mezclar harina, azúcar, arándanos y huevo.", "imagen": null},
                {"paso":"Hornear en moldes por 20 minutos.", "imagen": null}   
            ],
        dificultad: "Fácil",
        tiempo_preparacion: 30,
        id_usuario: 1
    },
    {
        titulo: "Enchiladas",
        foto_receta: "https://pixabay.com/es/images/download/mexican-245240_640.jpg",
        descripcion: "Enchiladas rellenas de pollo y cubiertas con salsa.",
        instrucciones:[{"paso":"Rellenar tortillas con pollo y enrollarlas.", "imagen": null},
                {"paso":"Cubrir con salsa y queso, y hornear.", "imagen": null}            
                
            ],
        dificultad: "Media",
        tiempo_preparacion: 45,
        id_usuario: 1
    },
    {
        titulo: "Risotto de champiñones",
        foto_receta: "https://pixabay.com/es/images/download/rice-4457143_640.jpg",
        descripcion: "Un cremoso risotto con champiñones y parmesano.",
        instrucciones: [{"paso":"Sofreír cebolla y champiñones.", "imagen": null},
                {"paso":"Agregar arroz y caldo poco a poco, removiendo.", "imagen": null},
                {"paso":"Finalizar con queso parmesano.", "imagen": null}
            ],
        dificultad: "Difícil",
        tiempo_preparacion: 50,
        id_usuario: 1
    },
    {
        titulo: "Burgers vegetarianas",
        foto_receta: "https://pixabay.com/es/images/download/veggie-burger-3685422_640.jpg",
        descripcion: "Hamburguesas de garbanzos y especias.",
        instrucciones: [{"paso":"Mezclar garbanzos, cebolla y especias.", "imagen": null},
                {"paso":"Formar hamburguesas y cocinarlas en sartén.", "imagen": null},
                {"paso":"Servir en pan con vegetales.", "imagen": null}
            ],
        dificultad: "Media",
        tiempo_preparacion: 30,
        id_usuario: 1
    },
    {
        titulo: "Tarta de queso",
        foto_receta: "https://pixabay.com/es/images/download/cheesecake-1578694_640.jpg",
        descripcion: "Tarta cremosa de queso, ideal para postre.",
        instrucciones: [{"paso":"Mezclar queso crema, azúcar y huevo.", "imagen": null},
                {"paso":"Verter en un molde y hornear por 50 minutos.", "imagen": null}   
            ],
        dificultad: "Media",
        tiempo_preparacion: 70,
        id_usuario: 1
    },
    {
        titulo: "Curry de verduras",
        foto_receta: "https://pixabay.com/es/images/download/green-curry-6386360_640.jpg",
        descripcion: "Curry aromático con verduras frescas.",
        instrucciones: [{"paso":"Saltear cebolla y ajo.", "imagen": null},
            {"paso":"Agregar verduras y pasta de curry.", "imagen": null},
            {"paso":"Cocinar a fuego lento con leche de coco.", "imagen": null}
        ],
        dificultad: "Media",
        tiempo_preparacion: 40,
        id_usuario: 1
    },
    {
        titulo: "Sushi",
        foto_receta: "https://pixabay.com/es/images/download/food-3581341_640.jpg",
        descripcion: "Sushi casero con pescado fresco y arroz.",
        instrucciones: [{"paso":"Cocinar el arroz y dejar enfriar.", "imagen": null},
                {"paso":"Colocar el pescado sobre el arroz y enrollar.", "imagen": null},
                {"paso":"Cortar en piezas y servir con salsa de soja.", "imagen": null}
            ],
        dificultad: "Difícil",
        tiempo_preparacion: 60,
        id_usuario: 1
    }
];


const insertarRecetas = async () => {
    for (const receta of recetas) {
        // Inserta la receta y obtén el ID
        const [nuevaReceta, creada] = await Receta.findOrCreate({
            where: { titulo: receta.titulo },
            defaults: receta
        });

        // Aquí puedes definir las categorías para cada receta
        const categorias = [
            { titulo: "Ensalada César", categorias: [1, 8] },
            { titulo: "Tarta de manzana", categorias: [6] },
            { titulo: "Pasta al pesto", categorias: [6] },
            { titulo: "Sopa de tomate", categorias: [6] },
            { titulo: "Tacos de pollo", categorias: [6] },
            { titulo: "Brownies de chocolate", categorias: [6] },
            { titulo: "Quiche de espinacas", categorias: [6] },
            { titulo: "Smoothie de frutas", categorias: [6] },
            { titulo: "Pancakes", categorias: [6] },
            { titulo: "Guiso de lentejas", categorias: [6] },
            { titulo: "Pizza Margherita", categorias: [6] },
            { titulo: "Muffins de arándano", categorias: [6] },
            { titulo: "Enchiladas", categorias: [6] },
            { titulo: "Risotto de champiñones", categorias: [6] },
            { titulo: "Burgers vegetarianas", categorias: [6] },
            { titulo: "Tarta de queso", categorias: [6] },
            { titulo: "Curry de verduras", categorias: [6] },
            { titulo: "Sushi", categorias: [6] },
        ];

        // Encuentra las categorías correspondientes a la receta actual
        const recetaCategorias = categorias.find(c => c.titulo === receta.titulo)?.categorias || [];

        // Inserta las categorías para la receta
        for (const idCategoria of recetaCategorias) {
            await Receta_Categoria.create({
                id_receta: nuevaReceta.id_receta,
                id_categoria: idCategoria
            });
        }
    }
};

// Llamar a la función para insertar las recetas y categorías
insertarRecetas().then(() => {
    console.log('Recetas y categorías insertadas exitosamente.');
}).catch(error => {
    console.error('Error al insertar recetas y categorías:', error);
});


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