import React from 'react';
import FollowButton from '@/components/followButton/FollowButton';

const CardUsuario = ({ item, currentUserId, followedUsers, handleFollow, handleUnfollow }) => {
    return ( 
        <div className="flex flex-col items-center pb-10 bg-white rounded-lg shadow-md p-6 h-64 w-full sm:w-80">
            <img 
                className="w-24 h-24 mb-3 rounded-full shadow-lg" 
                src={item.image || "http://localhost:3000/uploads/default-image.png"} 
                alt={`Imagen del usuario ${item.nombre}`} 
            />
            <h5 className="mb-1 text-xl font-medium text-gray-900">
                {item.nombre}
            </h5>
            <span className="text-sm text-gray-500">
                {item.descripcion_breve || ' '}
            </span>
            <div className="flex mt-4 gap-2 w-full">
                {item.id_usuario !== currentUserId && (
                    <div className="flex gap-2 w-full sm:w-auto">
                        {/* Botón de "Seguir" */}
                        {!followedUsers.has(item.id_usuario) && (
                            <FollowButton
                                id_usuario={item.id_usuario}
                                isFollowed={false}
                                onFollow={handleFollow}
                                onUnfollow={handleUnfollow}
                                className="w-full sm:w-32 py-2 px-4 text-sm font-medium text-white bg-blue-600 rounded-lg border border-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
                            />
                        )}
                        {/* Botón de "Dejar de seguir" */}
                        {followedUsers.has(item.id_usuario) && (
                            <FollowButton
                                id_usuario={item.id_usuario}
                                isFollowed={true}
                                onFollow={handleFollow}
                                onUnfollow={handleUnfollow}
                                className="w-full sm:w-32 py-2 px-4 text-sm font-medium text-white bg-red-600 rounded-lg border border-red-600 hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-200"
                            />
                        )}
                    </div>
                )}
                <a 
                    href={`/perfil/${item.id_usuario}`} 
                    className="w-full sm:w-auto py-2 px-4 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-300 hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
                >
                    Ver Perfil
                </a>
            </div>
        </div>
    );
};

export default CardUsuario;
