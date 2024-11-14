import { useState, useEffect } from 'react';

const FollowButton = ({ id_usuario, isFollowed, onFollow, onUnfollow }) => {
    const [followed, setFollowed] = useState(isFollowed);

    // Sincronizar el estado inicial del botón al cargar el componente
    useEffect(() => {
        setFollowed(isFollowed);
    }, [isFollowed]);

    const handleClick = async () => {
        try {
            if (followed) {
                await onUnfollow(id_usuario);
                setFollowed(false);
            } else {
                await onFollow(id_usuario);
                setFollowed(true);
            }
        } catch (error) {
            console.error('Error al seguir/dejar de seguir al usuario:', error);
            // Opcional: Mostrar un mensaje de error al usuario
        }
    };

    return (
        <button
            onClick={handleClick}
            className={`py-2 px-4 rounded-lg transition-all duration-200 ease-in-out 
                ${followed
                    ? 'bg-gray-300 hover:bg-red-200 hover:bg-opacity-60 text-gray-800'
                    : 'bg-blue-200 hover:bg-green-200 hover:bg-opacity-60 text-blue-800'}
                font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300`}
        >
            {followed ? 'Dejar de seguir' : 'Seguir'}
        </button>
    );
};

export default FollowButton;
