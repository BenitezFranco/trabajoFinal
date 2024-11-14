import Link from 'next/link';
import { FaFireAlt } from 'react-icons/fa';  // Ícono para la dificultad

const CardReceta = ({ item }) => {
    let fotoUrl = null;
    if (item.foto_receta) {
        fotoUrl = item.foto_receta;
    }

    return (
        <Link href={`/recipe/${item.id_receta}`} className="text-lg font-medium">
            <div className="relative rounded-lg shadow-sm hover:scale-102 transform transition-all duration-200 hover:shadow-lg hover:bg-gray-50">
                <div className="relative h-48 overflow-hidden rounded-t-lg transition-all duration-200 hover:opacity-80">
                    <img 
                        src={fotoUrl} 
                        alt={`Imagen de ${item.titulo}`} 
                        className="w-full h-full object-cover rounded-t-lg transition-all duration-300" 
                    />
                </div>
                <div className="p-4">
                    <h2 className="text-2xl font-bold mb-2 transition-all duration-200 hover:text-blue-500">{item.titulo}</h2>
                    <p className="text-sm text-gray-600 mb-1">{item.descripcion}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <FaFireAlt className="text-yellow-500" />  {/* Ícono de dificultad */}
                        <span>{item.dificultad}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default CardReceta;
