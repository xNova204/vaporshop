import React, { useState } from 'react';
import { Game } from '../types/types';
import { storage } from '../firebase/firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { dropdownStyle } from "../styles";

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
                ...(downloadURL && { imageUrl: downloadURL }),
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
        <div style={{ marginTop: "30px" }}>
            <h2 style={{ color: "#fff" }}>Add a New Game</h2>

            <div
                style={{
                    background: "linear-gradient(135deg, #7d3c98, #b784e1)",
                    padding: "20px",
                    borderRadius: "12px",
                    width: "350px",
                    color: "white",
                    boxShadow: "0 6px 12px rgba(0,0,0,0.25)",
                    marginBottom: "30px"
                }}
            >
                <label>Game Name:</label>
                <input
                    type="text"
                    value={newGame.name}
                    onChange={(e) => setNewGame({ ...newGame, name: e.target.value })}
                    style={{
                        width: "100%",
                        padding: "8px",
                        borderRadius: "8px",
                        border: "1px solid #c8a4ea",
                        margin: "8px 0",
                    }}
                />

                <label>Price:</label>
                <input
                    type="text"
                    value={newGame.price}
                    onChange={(e) => setNewGame({ ...newGame, price: e.target.value })}
                    style={{
                        width: "100%",
                        padding: "8px",
                        borderRadius: "8px",
                        border: "1px solid #c8a4ea",
                        margin: "8px 0",
                    }}
                />

                <label>Genre:</label>
                <select
                    value={newGame.genre}
                    onChange={(e) => setNewGame({ ...newGame, genre: e.target.value })}
                    style={dropdownStyle}
                >
                    {genres.map((genre) => (
                        <option key={genre} value={genre}>
                            {genre}
                        </option>
                    ))}
                </select>

                <label>Game Artwork:</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                        setNewGame({ ...newGame, imageFile: e.target.files?.[0] || null })
                    }
                    style={{ marginTop: "8px" }}
                />

                <button
                    onClick={handleAddGame}
                    disabled={isAdding}
                    style={{
                        width: "100%",
                        padding: "10px",
                        marginTop: "10px",
                        border: "none",
                        borderRadius: "8px",
                        background: "#4c2078",
                        color: "white",
                        cursor: "pointer",
                        fontWeight: "bold",
                    }}
                >
                    {isAdding ? "Adding..." : "Add Game"}
                </button>

                {statusMessage && (
                    <p style={{ marginTop: "10px", color: "white", fontStyle: "italic" }}>
                        {statusMessage}
                    </p>
                )}
            </div>

            <h2 style={{ color: "#fff" }}>Current Games</h2>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                {games.map((game) => (
                    <div
                        key={game.id}
                        style={{
                            background: "linear-gradient(135deg, #a066c9, #d7b0ff)",
                            padding: "20px",
                            borderRadius: "14px",
                            width: "220px",
                            boxShadow: "0 6px 12px rgba(0,0,0,0.2)",
                            color: "white",
                            transition: "transform 0.2s, box-shadow 0.2s",
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.transform = "scale(1.05)";
                            (e.currentTarget as HTMLElement).style.boxShadow =
                                "0 10px 18px rgba(0,0,0,0.28)";
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                            (e.currentTarget as HTMLElement).style.boxShadow =
                                "0 6px 12px rgba(0,0,0,0.2)";
                        }}
                    >
                        {game.imageUrl && (
                            <img
                                src={game.imageUrl}
                                alt={game.name}
                                style={{
                                    width: "100%",
                                    borderRadius: "10px",
                                    marginBottom: "10px",
                                    height: "120px",
                                    objectFit: "cover",
                                }}
                            />
                        )}

                        <h3 style={{ margin: "0 0 10px 0", fontSize: "20px", fontWeight: "bold" }}>
                            {game.name}
                        </h3>

                        <div
                            style={{
                                fontSize: "13px",
                                background: "rgba(255,255,255,0.25)",
                                padding: "2px 8px",
                                borderRadius: "12px",
                                display: "inline-block",
                                marginBottom: "10px",
                            }}
                        >
                            {game.genre}
                        </div>

                        <p
                            style={{
                                fontSize: "17px",
                                fontWeight: "bold",
                                background: "rgba(255,255,255,0.18)",
                                display: "inline-block",
                                padding: "4px 10px",
                                borderRadius: "10px",
                            }}
                        >
                            ${game.price}
                        </p>

                        <button
                            onClick={() => onRemoveGame(game.id)}
                            style={{
                                width: "100%",
                                padding: "8px",
                                marginTop: "12px",
                                background: "#6e3b9f",
                                border: "none",
                                borderRadius: "8px",
                                cursor: "pointer",
                                color: "white",
                            }}
                        >
                            Remove Game
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageGames;
