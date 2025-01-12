// src/components/GameList.tsx
import React from 'react';
import { Game } from '../types/types'; // Import Game type

interface GameListProps {
    games: Game[];
    onAddToWishlist: (game: Game) => void;
    onBuyGame: (game: Game) => void; // New prop for buying a game
}

const GameList: React.FC<GameListProps> = ({ games, onAddToWishlist, onBuyGame }) => {
    return (
        <ul>
            {games.map((game) => (
                <li key={game.id}>
                    {game.name} - {game.price} ({game.genre})
                    <button onClick={() => onAddToWishlist(game)}>Add to Wishlist</button>
                    <button onClick={() => onBuyGame(game)}>Buy Game</button> {/* Buy button */}
                </li>
            ))}
        </ul>
    );
};


export default GameList;
