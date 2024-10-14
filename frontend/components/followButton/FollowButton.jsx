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
            className={`py-1 px-3 rounded ${followed
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-green-500 hover:bg-green-600'
                } text-white font-bold`}
        >
            {followed ? 'Dejar de seguir' : 'Seguir'}
        </button>
    );
};

export default FollowButton;
