import Link from 'next/link';

const CardReceta = ({ item }) => {
    
    let fotoUrl= null;
    if(item.foto_receta){
        fotoUrl = item.foto_receta;
    }
    console.log("Imga",fotoUrl);
    return (
    <Link href={`/recipe/${item.id_receta}`} className="text-lg font-medium">
      <div className="relative h-48">
      
          <img src={fotoUrl} alt={`Imagen de ${item.titulo}`} className="w-full h-full object-cover" />
        
        </div>
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-2">{item.titulo}</h2>
        <p className="text-sm text-gray-600">Descripción: {item.descripcion}</p>
        <p className="text-sm text-gray-500">Dificultad: {item.dificultad}</p>
      </div>
    </Link>
  );
};

export default CardReceta;