// src/components/Wishlist.tsx
import React from 'react';

interface Game {
    name: string;
    price: string;
}

interface WishlistProps {
    games: Game[];
    onRemoveFromWishlist: (game: Game) => void;
}

const Wishlist: React.FC<WishlistProps> = ({ games, onRemoveFromWishlist }) => {
    if (games.length === 0) {
        return <h2>Your Wishlist is empty</h2>;
    }

    return (
        <div>
            <h2>Your Wishlist</h2>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {games.map((game) => (
                    <li
                        key={game.name}
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '10px 15px',
                            margin: '5px 0',
                            borderRadius: '5px',
                            backgroundColor: '#f57c00',
                            color: '#ffffff',
                        }}
                    >
                        <div>
                            <strong>{game.name}</strong>
                            <p>Price: {game.price}</p>
                        </div>
                        <button
                            onClick={() => onRemoveFromWishlist(game)}
                            style={{
                                padding: '5px 10px',
                                backgroundColor: '#d32f2f',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '3px',
                                cursor: 'pointer'
                            }}
                        >
                            Remove
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Wishlist;