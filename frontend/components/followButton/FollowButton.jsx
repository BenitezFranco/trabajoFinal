import { useState, useEffect } from 'react';

const FollowButton = ({ id_usuario, isFollowed, onFollow, onUnfollow }) => {
    const [followed, setFollowed] = useState(isFollowed);

    const handleClick = async () => {
        if (followed) {
            await onUnfollow(id_usuario);
            setFollowed(false);
        } else {
            await onFollow(id_usuario);
            setFollowed(true);
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
