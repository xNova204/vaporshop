import React, { useState } from 'react';
import { Game } from '../types/types';

interface ManageGamesProps {
    genres: string[];
    onAddGame: (game: Omit<Game, 'id'>) => void; // Omit `id` from the passed game object
    onRemoveGame: () => void;
    games: Game[];
}

const ManageGames: React.FC<ManageGamesProps> = ({ genres, onAddGame, onRemoveGame, games }) => {
    const [newGame, setNewGame] = useState<Pick<Game, 'name' | 'genre' | 'price'>>({
        name: '',
        genre: genres[0] || '',
        price: '', // Keep price as a string
    });

    const handleAddGame = () => {
        if (!newGame.name || !newGame.price || !newGame.genre) {
            return; // Show a warning if any fields are missing
        }

        const gameToAdd: Omit<Game, 'id'> = { // Explicitly omit `id` from the game object
            name: newGame.name,
            genre: newGame.genre,
            price: newGame.price, // String type
        };

        onAddGame(gameToAdd); // Call the function to add the game
        setNewGame({ name: '', genre: genres[0] || '', price: '' }); // Reset input fields
    };

    return (
        <div>
            <h2>Manage Games</h2>

            <div>
                <input
                    type="text"
                    placeholder="Game Name"
                    value={newGame.name}
                    onChange={(e) => setNewGame({ ...newGame, name: e.target.value })}
                />
                <select
                    value={newGame.genre}
                    onChange={(e) => setNewGame({ ...newGame, genre: e.target.value })}
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
                    onChange={(e) => setNewGame({ ...newGame, price: e.target.value })}
                />
                <button onClick={handleAddGame}>Add Game</button>
            </div>

            <div>
                <h3>Existing Games</h3>
                <ul>
                    {games.map((game) => (
                        <li key={game.id}>
                            {game.name} - ${game.price}
                            <button onClick={() => onRemoveGame()}>Remove</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ManageGames;
