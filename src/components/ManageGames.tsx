import React, { useState } from 'react';
import { Game } from '../types/types';
import { storage } from '../firebase/firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface ManageGamesProps {
    genres: string[];
    onAddGame: (game: Omit<Game, 'id'>) => void;
    onRemoveGame: (gameId: string) => void;
    games: Game[];
}

const ManageGames: React.FC<ManageGamesProps> = ({ genres, onAddGame, onRemoveGame, games }) => {
    const [newGame, setNewGame] = useState<{
        name: string;
        genre: string;
        price: string;
        imageFile: File | null;
    }>({
        name: '',
        genre: genres[0] || '',
        price: '',
        imageFile: null
    });

    const [isAdding, setIsAdding] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    const handleAddGame = async () => {
        if (!newGame.name || !newGame.genre || !newGame.price) {
            setStatusMessage("Please fill all fields.");
            return;
        }

        setIsAdding(true);
        setStatusMessage("Adding game...");

        let downloadURL: string | undefined;

        try {
            if (newGame.imageFile) {
                setStatusMessage("Uploading image...");
                const imageRef = ref(storage, `games/${Date.now()}-${newGame.imageFile.name}`);
                await uploadBytes(imageRef, newGame.imageFile);
                downloadURL = await getDownloadURL(imageRef);
            }

            const gameToSave: Omit<Game, "id"> = {
                name: newGame.name,
                genre: newGame.genre,
                price: newGame.price,
                ...(downloadURL && { imageUrl: downloadURL }), // only include if it exists
            };

            onAddGame(gameToSave);

            setStatusMessage("Game added successfully!");
            setNewGame({
                name: "",
                genre: genres[0] || "",
                price: "",
                imageFile: null,
            });
        } catch (error) {
            console.error(error);
            setStatusMessage("Error adding game.");
        }

        setIsAdding(false);
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

                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                        setNewGame({ ...newGame, imageFile: e.target.files?.[0] || null })
                    }
                />

                <div>
                    {statusMessage && <p>{statusMessage}</p>}
                    <button onClick={handleAddGame} disabled={isAdding}>
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
                            {game.imageUrl && (
                                <img
                                    src={game.imageUrl}
                                    alt={game.name}
                                    style={{ width: "60px", marginLeft: "10px" }}
                                />
                            )}
                            <button onClick={() => onRemoveGame(game.id)}>Remove</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ManageGames;