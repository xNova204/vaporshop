// src/components/ManageGames.tsx
import React, { useState } from 'react';

interface Game {
    name: string;
    price: string;
}

interface Genre {
    id: string;
    name: string;
    games: Game[];
}

interface ManageGamesProps {
    genres: Genre[];
    onAddGame: (genreId: string, game: Game) => void;
    onRemoveGame: (genreId: string, gameName: string) => void;
}

const ManageGames: React.FC<ManageGamesProps> = ({ genres, onAddGame, onRemoveGame }) => {
    const [selectedGenreId, setSelectedGenreId] = useState<string | null>(genres[0]?.id || null);
    const [newGame, setNewGame] = useState<Game>({ name: '', price: '' });
    const [error, setError] = useState<string | null>(null);

    const handleAddGame = () => {
        if (!newGame.name || !newGame.price || !selectedGenreId) {
            setError('Please fill out all fields before adding a game.');
            return;
        }

        setError(null);
        onAddGame(selectedGenreId, newGame);
        setNewGame({ name: '', price: '' }); // Reset the form
    };

    return (
        <div>
            <h2>Manage Games</h2>

            <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Select Genre</label>
                <select
                    value={selectedGenreId || ''}
                    onChange={(e) => setSelectedGenreId(e.target.value)}
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                >
                    {genres.map((genre) => (
                        <option key={genre.id} value={genre.id}>
                            {genre.name}
                        </option>
                    ))}
                </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Game Name</label>
                <input
                    type="text"
                    value={newGame.name}
                    onChange={(e) => setNewGame({ ...newGame, name: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                />
            </div>

            <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Price</label>
                <input
                    type="text"
                    value={newGame.price}
                    onChange={(e) => setNewGame({ ...newGame, price: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                />
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <button
                onClick={handleAddGame}
                style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#4caf50',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginBottom: '20px'
                }}
            >
                Add Game
            </button>

            <h3>Remove Existing Games</h3>
            {genres.map((genre) => (
                <div key={genre.id}>
                    <h4>{genre.name}</h4>
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {genre.games.map((game) => (
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
                                    <strong>{game.name}</strong> - {game.price}
                                </div>
                                <button
                                    onClick={() => onRemoveGame(genre.id, game.name)}
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
            ))}
        </div>
    );
};

export default ManageGames;
