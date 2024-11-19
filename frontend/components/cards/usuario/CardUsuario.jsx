import React from 'react';
import FollowButton from '@/components/followButton/FollowButton';

const CardUsuario = ({ item, currentUserId, followedUsers, handleFollow, handleUnfollow }) => {
    return ( 
        <div className="flex flex-col items-center pb-10 bg-white rounded-lg shadow-md p-6">
            <img 
                className="w-24 h-24 mb-3 rounded-full shadow-lg" 
                src={item.foto_perfil || "http://localhost:3000/uploads/default-image.png"} 
                alt={`Imagen del usuario ${item.nombre}`} 
            />
            <h5 className="mb-1 text-xl font-medium text-gray-900">
                {item.nombre}
            </h5>
            <span className="text-sm text-gray-500">
                {item.descripcion_breve || ' '}
            </span>
            <div className="flex mt-4">
                {item.id_usuario !== currentUserId && (
                    <FollowButton
                        id_usuario={item.id_usuario}
                        isFollowed={followedUsers.has(item.id_usuario)}
                        onFollow={handleFollow}
                        onUnfollow={handleUnfollow}
                    />
                )}
                <a 
                    href={`/perfil/${item.id_usuario}`} 
                    className="py-2 px-4 ms-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-300 hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
                >
                    Ver Perfil
                </a>
            </div>
        </div>
    );
}

export default CardUsuario;
