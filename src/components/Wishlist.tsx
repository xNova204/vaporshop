// src/components/Wishlist.tsx
import React from 'react';
import { Game } from '../types/types'; // Import Game type

interface WishlistProps {
    games: Game[];
    onRemoveFromWishlist: (game: Game) => void;
    onBuyGame: (game: Game) => void; // Add onBuyGame prop
}

const Wishlist: React.FC<WishlistProps> = ({ games, onRemoveFromWishlist, onBuyGame }) => {
    return (
        <div>
            <h3>Your Wishlist</h3>
            <ul>
                {games.map((game) => (
                    <li key={game.id}>
                        {game.name} - {game.price} ({game.genre})
                        <button onClick={() => onRemoveFromWishlist(game)}>Remove</button>
                        <button onClick={() => onBuyGame(game)}>Buy</button> {/* Add Buy button */}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Wishlist;
