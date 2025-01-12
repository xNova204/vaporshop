import React, { useState, useEffect } from 'react';
import { addGameToFirestore, fetchGamesFromFirestore, deleteGameFromFirestore } from '../firebase/firestore';

interface Game {
    id: string;
    name: string;
    price: string;
    genre: string;
}

interface ManageGamesProps {
    genres: { id: string; name: string }[];  // Genres array as before
    onAddGame: (genreId: string, game: Game) => void;  // Add the type for onAddGame
    onRemoveGame: (genreId: string, gameName: string) => void;  // Add the type for onRemoveGame
}

const ManageGames: React.FC<ManageGamesProps> = ({ genres, onAddGame, onRemoveGame }) => {
    const [games, setGames] = useState<Game[]>([]);
    const [newGame, setNewGame] = useState<Omit<Game, "id">>({
        name: "",
        price: "",
        genre: "",
    });

    // Fetch games from Firestore when component mounts
    useEffect(() => {
        const loadGames = async () => {
            const fetchedGames = await fetchGamesFromFirestore();
            setGames(fetchedGames as Game[]);
        };
        loadGames();
    }, []);

    // Handle adding a game
    const handleAddGame = async () => {
        if (!newGame.name || !newGame.price || !newGame.genre) {
            alert("Please fill out all fields.");
            return;
        }

        // Add the game to Firestore
        const addedGame = await addGameToFirestore(newGame);

        // If Firestore successfully returns the game with its generated ID, update the state
        if (addedGame) {
            setGames((prevGames) => [...prevGames, addedGame]);  // Add the game with the generated ID
            onAddGame(newGame.genre, addedGame);  // Call the prop function for adding the game
            setNewGame({ name: "", price: "", genre: "" });  // Reset the form
        }
    };

    // Handle deleting a game
    const handleDeleteGame = async (gameId: string, genreId: string, gameName: string) => {
        await deleteGameFromFirestore(gameId);
        setGames((prevGames) => prevGames.filter((game) => game.id !== gameId));
        onRemoveGame(genreId, gameName);  // Call the prop function for removing the game
    };

    return (
        <div>
            <h2>Manage Games</h2>
            <div>
                <input
                    type="text"
                    placeholder="Name"
                    value={newGame.name}
                    onChange={(e) =>
                        setNewGame((prev) => ({ ...prev, name: e.target.value }))
                    }
                />
                <input
                    type="text"
                    placeholder="Price"
                    value={newGame.price}
                    onChange={(e) =>
                        setNewGame((prev) => ({ ...prev, price: e.target.value }))
                    }
                />
                <select
                    value={newGame.genre}
                    onChange={(e) =>
                        setNewGame((prev) => ({ ...prev, genre: e.target.value }))
                    }
                >
                    <option value="">Select Genre</option>
                    {genres.map((genre) => (
                        <option key={genre.id} value={genre.name}>
                            {genre.name}
                        </option>
                    ))}
                </select>
                <button onClick={handleAddGame}>Add Game</button>
            </div>

            <h3>Games List</h3>
            <ul>
                {games.map((game) => (
                    <li key={game.id}>
                        {game.name} - {game.price} ({game.genre})
                        <button onClick={() => handleDeleteGame(game.id, game.genre, game.name)}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ManageGames;
