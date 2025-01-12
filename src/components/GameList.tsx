// src/components/GameList.tsx
import React from 'react';
import { Game } from '../types/types'; // Import Game type

interface GameListProps {
    games: Game[];
    onAddToWishlist: (game: Game) => void;
}

const GameList: React.FC<GameListProps> = ({ games, onAddToWishlist }) => {
    return (
        <ul>
            {games.map((game) => (
                <li key={game.id}>
                    {game.name} - {game.price} ({game.genre})
                    <button onClick={() => onAddToWishlist(game)}>Add to Wishlist</button>
                </li>
            ))}
        </ul>
    );
};

export default GameList;
