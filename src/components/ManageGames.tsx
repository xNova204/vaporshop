import React, { useState } from 'react';
import { Game } from '../types/types';
import { addGameToFirestore, deleteGameFromFirestore } from '../firebase/firestore';

interface ManageGamesProps {
    genres: string[];
    onAddGame: (game: Omit<Game, 'id'>) => void; // Omit `id` from the passed game object
    onRemoveGame: (gameId: string) => void; // Accept a game ID to remove the correct game
    games: Game[];
}

const ManageGames: React.FC<ManageGamesProps> = ({ genres, onAddGame, onRemoveGame, games }) => {
    const [newGame, setNewGame] = useState<Pick<Game, 'name' | 'genre' | 'price'>>({
        name: '',
        genre: genres[0] || '', // Default to the first genre if available
        price: '', // Keep price as a string
    });

    const handleAddGame = async () => {
        if (!newGame.name || !newGame.price || !newGame.genre) {
            alert('Please fill in all the fields.');
            return; // Show a warning if any fields are missing
        }

        const gameToAdd: Omit<Game, 'id'> = {
            name: newGame.name,
            genre: newGame.genre,
            price: newGame.price, // Keep price as a string type
        };

        try {
            // Add the new game to Firestore
            await addGameToFirestore(gameToAdd);
            onAddGame(gameToAdd); // Update parent state with the new game
            setNewGame({ name: '', genre: genres[0] || '', price: '' }); // Reset fields
            alert('Game added successfully!');
        } catch (error) {
            console.error('Error adding game:', error);
            alert('Failed to add game.');
        }
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
                            <button onClick={() => onRemoveGame(game.id)}>Remove</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ManageGames;
