// src/components/Wishlist.tsx
import React from 'react';
import { Game } from '../types/types';

interface WishlistProps {
    games: Game[];
    onRemoveFromWishlist: (game: Game) => void;
    onBuyGame: (game: Game) => void;
}

const Wishlist: React.FC<WishlistProps> = ({ games, onRemoveFromWishlist, onBuyGame }) => {
    return (
        <div>
            <h3>Your Wishlist</h3>
            <ul>
                {games.map((game) => (
                    <li key={game.id} style={{ marginBottom: '20px' }}>
                        <h4>{game.name}</h4>
                        {game.imageUrl && (
                            <img
                                src={game.imageUrl}
                                alt={game.name}
                                style={{ width: "100px", display: "block", marginBottom: "10px" }}
                            />
                        )}
                        <p>{game.genre}</p>
                        <p>{game.price}</p>
                        <button onClick={() => onRemoveFromWishlist(game)}>Remove</button>
                        <button onClick={() => onBuyGame(game)}>Buy</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Wishlist;
