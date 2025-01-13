// GameList.tsx
import React from 'react';
import { Game } from '../types/types';

interface GameListProps {
    games: Game[];
    onAddToWishlist: (game: Game) => void;
    onBuyGame: (game: Game) => Promise<void>;
    onGameSelect: (game: Game) => void;  // Add this line
}

const GameList: React.FC<GameListProps> = ({ games, onAddToWishlist, onBuyGame, onGameSelect }) => {
    return (
        <div>
            {games.map((game) => (
                <div key={game.id} style={{ marginBottom: '20px' }}>
                    <h3>{game.name}</h3>
                    <p>{game.genre}</p>
                    <p>{game.price}</p>
                    <button onClick={() => onGameSelect(game)}>View Details</button> {/* Add this button */}
                    <button onClick={() => onAddToWishlist(game)}>Add to Wishlist</button>
                    <button onClick={() => onBuyGame(game)}>Buy Game</button>
                </div>
            ))}
        </div>
    );
};

export default GameList;
