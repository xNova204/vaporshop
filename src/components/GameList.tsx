// src/components/GameList.tsx
import React from 'react';

interface Game {
    name: string;
    price: string;
}

interface GameListProps {
    games: Game[];
    onAddToWishlist: (game: Game) => void;
}

const GameList: React.FC<GameListProps> = ({ games, onAddToWishlist }) => {
    return (
        <div>
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
                            backgroundColor: '#2196f3',
                            color: '#ffffff',
                        }}
                    >
                        <div>
                            <strong>{game.name}</strong>
                            <p>Price: {game.price}</p>
                        </div>
                        <button
                            onClick={() => onAddToWishlist(game)}
                            style={{
                                padding: '5px 10px',
                                backgroundColor: '#4caf50',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '3px',
                                cursor: 'pointer'
                            }}
                        >
                            Add to Wishlist
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GameList;