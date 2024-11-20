import Link from 'next/link';


const CardRecetaC = ({ item }) => {
    const fotoUrl = item.foto_receta || null;

    return (
        <Link href={`/recipe/${item.id_receta}`} className="text-lg font-medium">
            <div className="relative rounded-lg shadow-sm hover:scale-102 transform transition-all duration-200 hover:shadow-lg hover:bg-gray-50">
                {/* Imagen de la receta */}
                <div className="relative h-32 overflow-hidden rounded-t-lg transition-all duration-200 hover:opacity-80">
                    <img 
                        src={fotoUrl} 
                        alt={`Imagen de ${item.titulo}`} 
                        className="w-full h-full object-cover rounded-t-lg transition-all duration-300" 
                    />
                </div>
                {/* Título y dificultad */}
                <div className="p-2 text-center">
                    <h2 className="text-lg font-bold mb-1 transition-all duration-200 hover:text-blue-500 truncate">
                        {item.titulo}
                    </h2>
                
                </div>
            </div>
        </Link>
    );
};

export const CardGrid = ({ recetas }) => {
    return (
        <div className="grid grid-cols-7 gap-4">
            {recetas.map((receta) => (
                <CardRecetaC key={receta.id_receta} item={receta} />
            ))}
        </div>
    );
};

export default CardRecetaC;
