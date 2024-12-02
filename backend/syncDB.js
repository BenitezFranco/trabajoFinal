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
        tiempo_preparacion: 40,
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
        id_usuario: 2
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
        id_usuario: 2
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
        id_usuario: 2
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
                {"paso":"Cocinar en una sartén caliente y servir con sirope.", "imagen": null},
                
            ],
        dificultad: "Fácil",
        tiempo_preparacion: 20,
        id_usuario: 2
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
        id_usuario: 2
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
        id_usuario: 2
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
        id_usuario: 2
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
        id_usuario: 2
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
    },
    {
        titulo: "Pizza Pepperoni",
        foto_receta: "https://pixabay.com/es/images/download/pizza-5179939_640.jpg",
        descripcion: "Pizza con base de tomate, queso mozzarella y rodajas de pepperoni.",
        instrucciones: [
            {"paso": "Extender la masa sobre una bandeja para hornear.", "imagen": null},
            {"paso": "Cubrir con salsa de tomate y queso mozzarella.", "imagen": null},
            {"paso": "Añadir las rodajas de pepperoni encima.", "imagen": null},
            {"paso": "Hornear a 220°C durante 12-15 minutos.", "imagen": null}
        ],
        dificultad: "Fácil",
        tiempo_preparacion: 30,
        id_usuario: 2
    },
    {
        "titulo": "Pizza Cuatro Quesos",
        "foto_receta": "https://pixabay.com/es/images/download/pizza-3007395_640.jpg",
        "descripcion": "Pizza cremosa con una mezcla de cuatro quesos.",
        "instrucciones": [
            {"paso": "Preparar la base de masa sobre una bandeja.", "imagen": null},
            {"paso": "Untar la base con una fina capa de salsa de tomate.", "imagen": null},
            {"paso": "Añadir mozzarella, queso azul, parmesano y queso de cabra.", "imagen": null},
            {"paso": "Hornear a 220°C durante 10-12 minutos hasta que los quesos se derritan.", "imagen": null}
        ],
        "dificultad": "Media",
        "tiempo_preparacion": 40,
        "id_usuario": 1
    },
    {
        "titulo": "Pizza Hawaiana",
        "foto_receta": "https://pixabay.com/es/images/download/pizza-5501075_640.jpg",
        "descripcion": "Una pizza tropical con jamón y piña.",
        "instrucciones": [
            {"paso": "Extender la masa y colocarla en una bandeja para hornear.", "imagen": null},
            {"paso": "Cubrir con salsa de tomate y queso mozzarella.", "imagen": null},
            {"paso": "Distribuir el jamón y los trozos de piña sobre la pizza.", "imagen": null},
            {"paso": "Hornear a 200°C durante 15-18 minutos.", "imagen": null}
        ],
        "dificultad": "Fácil",
        "tiempo_preparacion": 35,
        "id_usuario": 2
    },{
        titulo: "Ensalada de Pollo y Aguacate",
        foto_receta: "https://pixabay.com/es/images/download/vegetable-salad-320719_640.jpg",
        descripcion: "Una ensalada fresca y saludable, perfecta para el almuerzo, con pollo a la parrilla, aguacate cremoso y una vinagreta ligera.",
        instrucciones: [
                {"paso":"Cocinar las pechugas de pollo a la parrilla o a la plancha, sazonadas con sal y pimienta, hasta que estén doradas y completamente cocidas. Cortar el pollo en tiras.", "imagen": null}
                ,
                {"paso":"En un bol grande, mezclar las hojas verdes con el tomate, pepino y aguacate.", "imagen": null}
                ,
                {"paso":"En un tazón pequeño, preparar la vinagreta mezclando el aceite de oliva, jugo de limón, mostaza, sal y pimienta.", "imagen": null}
                ,
                {"paso":"Agregar el pollo a la ensalada, verter la vinagreta por encima y mezclar todo suavemente.", "imagen": null}
                
            ],
        dificultad: "Media",
        tiempo_preparacion: 30,
        id_usuario: 3
    },
    {
        titulo: "Ensalada Griega",
        foto_receta: "https://pixabay.com/es/images/download/salad-2430919_640.jpg",
        descripcion: "Una ensalada refrescante con pepino, tomate, aceitunas y queso feta, ideal para los días calurosos.",
        instrucciones: [
                {"paso":"Cortar el pepino y los tomates en rodajas.", "imagen": null}
                ,
                {"paso":"Mezclar en un bol con las aceitunas y el queso feta.", "imagen": null}
                ,
                {"paso":"Aderezar con aceite de oliva, jugo de limón, sal y pimienta.", "imagen": null}
                ,
                {"paso":"Revolver bien y servir.", "imagen": null}
                
            ],
        dificultad: "Fácil",
        tiempo_preparacion: 20,
        id_usuario: 3
    },
    {
        titulo: "Ensalada de Atún",
        foto_receta: "https://pixabay.com/es/images/download/salad-1088411_640.jpg",
        descripcion: "Una ensalada rápida y nutritiva con atún, zanahoria y maíz, ideal para un almuerzo ligero.",
        instrucciones: [
                {"paso":"Escurrir el atún y desmenuzarlo.", "imagen": null}
                ,
                {"paso":"Mezclar el atún con la lechuga, zanahoria y maíz.", "imagen": null}
                ,
                {"paso":"Agregar la mayonesa y la mostaza.", "imagen": null}
                ,
                {"paso":"Sazonar con sal y pimienta, y mezclar bien.", "imagen": null}
                
            ],
        dificultad: "Fácil",
        tiempo_preparacion: 15,
        id_usuario: 3
    },
    {
        titulo: "Ensalada de Quinoa",
        foto_receta: "https://pixabay.com/es/images/download/quinoa-2011771_640.jpg",
        descripcion: "Una clásica ensalada César con pollo a la parrilla.",
        instrucciones: [
                {"paso":"Cocinar la quinoa según las instrucciones del paquete.", "imagen": null}
                ,
                {"paso":"Mezclar la quinoa cocida con los pepinos, pimientos, cebolla y garbanzos.", "imagen": null}
                ,
                {"paso":"Aderezar con aceite de oliva, jugo de limón, sal y pimienta.", "imagen": null}
                ,
                {"paso":"Revolver y servir.", "imagen": null}
                
            ],
        dificultad: "Media",
        tiempo_preparacion: 30,
        id_usuario: 3
    },
    {
        titulo: "Ensalada de Espinacas y Fresas",
        foto_receta: "https://img.freepik.com/foto-gratis/ensalada-deliciosa_144627-14776.jpg?t=st=1733158569~exp=1733162169~hmac=221170472962cd4e2ca752b83de2a64643a7ce3c304ad8531b15871cfd89180d&w=360",
        descripcion: "Una ensalada ligera y fresca con espinacas, fresas y nueces, perfecta para acompañar una comida o como plato principal.",
        instrucciones: [
                {"paso":"Lavar las espinacas y colocarlas en un bol.", "imagen": null}
                ,
                {"paso":"Agregar las fresas, las nueces y el queso de cabra.", "imagen": null}
                ,
                {"paso":"Preparar el aderezo mezclando vinagre balsámico y miel.", "imagen": null}
                ,
                {"paso":"Verter el aderezo sobre la ensalada y mezclar.", "imagen": null}
                
            ],
        dificultad: "Fácil",
        tiempo_preparacion: 20,
        id_usuario: 3
    },
    
    
    
];


const insertarRecetas = async () => {
    const categorias = [
        { titulo: "Ensalada César", categorias: [14, 8,7,9] },
        { titulo: "Tarta de manzana", categorias: [3,6,13] },
        { titulo: "Pasta al pesto", categorias: [8,9,10] },
        { titulo: "Sopa de tomate", categorias: [2,7,15] },
        { titulo: "Tacos de pollo", categorias: [11] },
        { titulo: "Brownies de chocolate", categorias: [3,6,13] },
        { titulo: "Quiche de espinacas", categorias: [8,9] },
        { titulo: "Smoothie de frutas", categorias: [3,12,13] },
        { titulo: "Pancakes", categorias: [3,6,13] },
        { titulo: "Guiso de lentejas", categorias: [8,9,10] },
        { titulo: "Pizza Margherita", categorias: [8,9,10] },
        { titulo: "Muffins de arándano", categorias: [3,6,13] },
        { titulo: "Enchiladas", categorias: [11] },
        { titulo: "Risotto de champiñones", categorias: [1,8,9,10] },
        { titulo: "Burgers vegetarianas", categorias: [1,2,8,9,10] },
        { titulo: "Tarta de queso", categorias: [3,6,13] },
        { titulo: "Curry de verduras", categorias: [1,2,8,9,10] },
        { titulo: "Sushi", categorias: [8,9,10] },
        { titulo: "Pizza Pepperoni", categorias: [8,9,10] },
        { titulo: "Pizza Cuatro Quesos", categorias: [1,8,9,10] },
        { titulo: "Pizza Hawaiana", categorias: [8,9,10] },
        { titulo: "Ensalada de Pollo y Aguacate", categorias: [14, 8,7,9] },
        { titulo: "Ensalada Griega", categorias: [14, 8,7,9] },
        { titulo: "Ensalada de Atún", categorias: [14, 8,7,9] },
        { titulo: "Ensalada de Quinoa", categorias: [14, 8,7,9] },
        { titulo: "Ensalada de Espinacas y Fresas", categorias: [14, 8,7,9] },
        
    ];
    
    // Aquí puedes definir las categorías para cada receta
    const ingredientes = [
        { titulo: "Ensalada César", ingredientes: [19, 31,58,296], cantidades: ["2 tazas", "1 pechuga de pollo", "1/2 taza","1/2 taza"] },
        { titulo: "Tarta de manzana", ingredientes: [64,40,43,297,54],cantidades:["2 piezas","1/2 taza","1 cucharadita","1 base","2 cucharadas"] },
        { titulo: "Pasta al pesto", ingredientes: [38,15,53,58,298],cantidades:["250 g","1 taza","1/4 taza","1/2 taza","1/4 taza"]},
        { titulo: "Sopa de tomate", ingredientes: [1,2,119,57,15], cantidades:["3 piezas","1/2 pieza","2 tazas","1/4 taza","al gusto"] },
        { titulo: "Tacos de pollo", ingredientes: [169,31,2,23,299], cantidades:["4 piezas","200 g","1/4 pieza","al gusto","al gusto"] },
        { titulo: "Brownies de chocolate", ingredientes: [205,54,40,39,29], cantidades:["1 taza","1/2 taza","1/2 taza","1/2 taza","2 piezas"] },
        { titulo: "Quiche de espinacas", ingredientes: [6,30,55,29,297], cantidades:["2 tazas","1/2 taza","1/2 taza","3 piezas","1 base"]},
        { titulo: "Smoothie de frutas", ingredientes: [300,301,56,61,302], cantidades:["1 pieza","1 taza","1/2 taza","1 cucharadita","al gusto"] },
        { titulo: "Pancakes", ingredientes: [39,55,29,303,54], cantidades:["1 taza","1/2 taza","1 pieza","1 cucharadita","2 cucharadas"] },
        { titulo: "Guiso de lentejas", ingredientes: [35,5,2,7,119], cantidades:["1 taza","2 piezas","1/2 piezas","1 diente","2 taza"] },
        { titulo: "Pizza Margherita", ingredientes: [99,127,178,15,53], cantidades:["1 base","1/2 taza","1 taza","al gusto","al gusto"] },
        { titulo: "Muffins de arándano", ingredientes: [39,40,55,29,304], cantidades:["1 taza","1/2 taza","1/2 taza","1 pieza","1/2 taza"] },
        { titulo: "Enchiladas", ingredientes: [169,32,299,58,57], cantidades:["4 piezas","200 g","1/2 taza","1/4 taza","al gusto"] },
        { titulo: "Risotto de champiñones", ingredientes: [37,13,118,58,54], cantidades:["1 taza","200 g","2 taza","1/2 taza","2 cucharadas"] },
        { titulo: "Burgers vegetarianas", ingredientes: [121,6,98,19,305], cantidades:["1 taza","1/2 taza","2 piezas","al gusto","al gusto"] },
        { titulo: "Tarta de queso", ingredientes: [307,40,29,173,216], cantidades:["500 g","1/2 taza","2 piezas","1/4 taza","1 taza (trituradas)"] },
        { titulo: "Curry de verduras", ingredientes: [11,5,10,140,183], cantidades:["1 taza","1 taza","1 taza","1 taza","1 cucharada"] },
        { titulo: "Sushi", ingredientes: [37,163,104,20,308], cantidades:["200 g","1 hoja","100 g","1/4 pieza","al gusto"] },
        {titulo: "Pizza Pepperoni", ingredientes: [99,127,178,310,16], cantidades: ["1 base","1/2 taza","1 taza","1/2 taza","al gusto"]},
        {titulo: "Pizza Cuatro Quesos", ingredientes: [99,127,178,174,58,309], cantidades: ["1 base","1/4 taza","1/2 taza","1/4 taza","1/4 taza","1/4 taza"]},
        {titulo: "Pizza Hawaiana", ingredientes: [99,127,178,311,68,16], cantidades: ["1 base","1/2 taza","1 taza","1/2 taza","1/2 taza","al gusto"]},
        { titulo: "Ensalada de Pollo y Aguacate", ingredientes: [31,151,6,1,20,53,235,49], cantidades: ["aproximadamente 300 g","1 en rodajas","4 tazas","1 grande, en cubos","1/2, en rodajas","1 cucharada","de 1 limon","1 cucharadita"] },
        { titulo: "Ensalada Griega", ingredientes: [20,1,101,30,53,235,41,42], cantidades: ["2 tazas, en rodajas","1 taza","1/2 taza","1 taza, en feta desmenuzado","1 cucharada","de 1/2 limon","al gusto","al gusto"] },
        { titulo: "Ensalada de Atún", ingredientes: [105,19,5,26,306,49,41,42], cantidades: ["1 lata","2 tazas","1/2 taza (rallada)","1/2 taza","2 cucharadas","1 cucharada","al gusto","al gusto"] },
        { titulo: "Ensalada de Quinoa", ingredientes: [93,20,3,195,121,53,235,41,42], cantidades: ["1 taza, cocida","1 taza, en cubos","1 taza, en cubos","1/2 taza, picada","1/2 taza, cocidos","2 cucharadas","de 1 limon","al gusto","al gusto"] },
        { titulo: "Ensalada de Espinacas y Fresas", ingredientes: [6,74,87,309,312,61], cantidades: ["4 tazas","1 taza, en rodajas","1/2 taza, troceadas","1/4 taza, desmenuzado","2 cucharadas","1 cucharada"] },
        
    ];
    for (const receta of recetas) {
        // Inserta la receta y obtén el ID
        const [nuevaReceta, creada] = await Receta.findOrCreate({
            where: { titulo: receta.titulo },
            defaults: {
                ...receta,
                fecha_publicacion: new Date().toISOString().split('T')[0]
            }
        });

        if (!creada) {
            console.log(`La receta '${receta.titulo}' ya existe. Se omite su creación.`);
            continue; // Si la receta ya existe, salta al siguiente elemento del bucle
        }

        // Encuentra las categorías correspondientes a la receta actual
        const recetaCategorias = categorias.find(c => c.titulo === receta.titulo)?.categorias || [];

        // Inserta las categorías para la receta
        for (const idCategoria of recetaCategorias) {
            await Receta_Categoria.create({
                id_receta: nuevaReceta.id_receta,
                id_categoria: idCategoria
            });
        }

        // Encuentra los ingredientes correspondientes a la receta actual
        const recetaIngredientesData = ingredientes.find(c => c.titulo === receta.titulo);
        const recetaIngredientes = recetaIngredientesData ? recetaIngredientesData.ingredientes : [];
        const cantidades = recetaIngredientesData ? recetaIngredientesData.cantidades : [];

        console.log("titulo: ",nuevaReceta.titulo);
        console.log(" ",recetaIngredientes.length);
        // Inserta los ingredientes para la receta
        for (let i = 0; i < recetaIngredientes.length; i++) {
            await Receta_Ingrediente.findOrCreate({
                where: {
                    id_receta: nuevaReceta.id_receta,
                    id_ingrediente: recetaIngredientes[i]
                },
                defaults: {
                    cantidad: cantidades[i] // Asignar la cantidad correspondiente
                }
            });
        }
    };
};


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
        { nombre: 'Crema ácida' }, { nombre: 'Queso azul' }, { nombre: 'Queso feta' }, { nombre: 'Queso brie' },
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
        { nombre: 'Tequila' },{ nombre: 'Agua' },{nombre:'Crutones'},{nombre:'Masa para tarta'},
        {nombre: 'Piñones'},{nombre: 'Salsa'},{nombre: 'Banana'},{nombre: 'Frutos rojos'},
        {nombre: 'Hielo'},{nombre: 'Polvo de hornear'},{nombre: 'Arándanos'},{nombre:'Mayonesa vegana'},
        {nombre: 'Mayonesa'},{nombre: 'Queso Crema'},{nombre: 'Salsa de soya'},{nombre: 'Queso de cabra'},
        {nombre: 'Pepperoni'}, {nombre:'Jamón cocido'},{nombre:'Vinagre balsámico'}
    ];

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
        {
            nombre: 'Santi',
            correo_electronico: 'santi@santi.com',
            contrasena: 'santi123',
        },
        {
            nombre: 'Abigail',
            correo_electronico: 'abi@abi.com',
            contrasena: 'abigail123',
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
        await insertarRecetas();//Inserta Recetas
       console.log('Base de datos sincronizada correctamente.');
    } catch (error) {
        console.error('Error al sincronizar la base de datos:', error);
    }
};

module.exports = syncDatabase;