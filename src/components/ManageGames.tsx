import React, { useState} from 'react';
import { Game } from '../types/types';


interface ManageGamesProps {
    genres: string[];
    onAddGame: (game: Omit<Game, 'id'>) => void;
    onRemoveGame: (gameId: string) => void;
    games: Game[];
}

const ManageGames: React.FC<ManageGamesProps> = ({ genres, onAddGame, onRemoveGame, games }) => {
    const [newGame, setNewGame] = useState<Pick<Game, 'name' | 'genre' | 'price'>>({
        name: '',
        genre: genres[0] || '',
        price: '',
    });
    const [isAdding] = useState(false); // Add loading state
    const [statusMessage] = useState<string | null>(null); // Add status message state

    // Prevent duplicate submissions with useCallback and isAdding guard
    const handleAddGame = (game: Omit<Game, 'id'>) => {
        onAddGame(game); // Call the parent's handleAddGame
    };


    return (
        <div>
            <h2>Manage Games</h2>

            <div>
                <input
                    type="text"
                    placeholder="Game Name"
                    value={newGame.name}
                    onChange={(e) => setNewGame({...newGame, name: e.target.value})}
                />
                <select
                    value={newGame.genre}
                    onChange={(e) => setNewGame({...newGame, genre: e.target.value})}
                >
                    {genres.map((genre) => (
                        <option key={genre} value={genre}>
                            {genre}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    placeholder="Price"
                    value={newGame.price}
                    onChange={(e) => setNewGame({...newGame, price: e.target.value})}
                />
                <div>
                    {statusMessage && <p>{statusMessage}</p>} {/* Display status message */}
                    <button
                        onClick={() => handleAddGame(newGame)} // Wrap the function
                        disabled={isAdding}
                    >
                        {isAdding ? 'Adding...' : 'Add Game'}
                    </button>
                </div>
            </div>


            <div>
                <h3>Existing Games</h3>
                <ul>
                    {games.map((game) => (
                        <li key={game.id}>
                            {game.name} - ${game.price}
                            <button onClick={() => onRemoveGame(game.id)}>Remove</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ManageGames;
