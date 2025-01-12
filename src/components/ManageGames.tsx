import React, { useState, useEffect } from "react";
import {
    addGameToFirestore,
    fetchGamesFromFirestore,
    deleteGameFromFirestore,
} from "../firebase/firestore";

interface Game {
    id: string;
    name: string;
    price: string;
    genre: string;
}

const ManageGames: React.FC<{ genres: { id: string; name: string }[] }> = ({ genres }) => {
    const [games, setGames] = useState<Game[]>([]); // Use Game type for state
    const [newGame, setNewGame] = useState<Omit<Game, "id">>({
        name: "",
        price: "",
        genre: "",
    }); // Exclude 'id' for new game input

    useEffect(() => {
        const loadGames = async () => {
            const fetchedGames = await fetchGamesFromFirestore();
            setGames(fetchedGames as Game[]); // Type assertion to Game[]
        };
        loadGames();
    }, []);

    const handleAddGame = async () => {
        await addGameToFirestore(newGame);
        setGames((prevGames) => [
            ...prevGames,
            { id: Date.now().toString(), ...newGame }, // Temporary ID
        ]);
        setNewGame({ name: "", price: "", genre: "" });
    };

    const handleDeleteGame = async (gameId: string) => {
        await deleteGameFromFirestore(gameId);
        setGames((prevGames) => prevGames.filter((game) => game.id !== gameId));
    };

    return (
        <div>
            <h2>Manage Games</h2>
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

            <ul>
                {games.map((game) => (
                    <li key={game.id}>
                        {game.name} - {game.price} ({game.genre})
                        <button onClick={() => handleDeleteGame(game.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ManageGames;
