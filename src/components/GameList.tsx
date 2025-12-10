// GameList.tsx
import React from 'react';
import { Game } from '../types/types';

interface GameListProps {
    games: Game[];
    onAddToWishlist: (game: Game) => void;
    onBuyGame: (game: Game) => Promise<void>;
    onGameSelect: (game: Game) => void;
}

const GameList: React.FC<GameListProps> = ({ games, onAddToWishlist, onBuyGame, onGameSelect }) => {
    return (
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
                        cursor: "pointer"
                    }}
                    onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.transform = "scale(1.05)";
                        (e.currentTarget as HTMLElement).style.boxShadow = "0 10px 18px rgba(0,0,0,0.28)";
                    }}
                    onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                        (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 12px rgba(0,0,0,0.2)";
                    }}
                >
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
                            marginBottom: "10px"
                        }}
                    >
                        {game.genre}
                    </div>

                    <p
                        style={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            marginBottom: "12px",
                            background: "rgba(255,255,255,0.18)",
                            display: "inline-block",
                            padding: "4px 10px",
                            borderRadius: "10px"
                        }}
                    >
                        ${game.price}
                    </p>

                    {onGameSelect && (
                        <button
                            onClick={() => onGameSelect(game)}
                            style={{
                                width: "100%",
                                padding: "8px",
                                borderRadius: "8px",
                                border: "none",
                                marginBottom: "8px",
                                background: "#5a2d81",
                                color: "white",
                                cursor: "pointer"
                            }}
                        >
                            Details + Reviews
                        </button>
                    )}

                    {onAddToWishlist && (
                        <button
                            onClick={() => onAddToWishlist(game)}
                            style={{
                                width: "100%",
                                padding: "8px",
                                borderRadius: "8px",
                                border: "none",
                                background: "#6e3b9f",
                                color: "white",
                                cursor: "pointer"
                            }}
                        >
                            Add to Wishlist
                        </button>
                    )}

                    {onBuyGame && (
                        <button
                            onClick={() => onBuyGame(game)}
                            style={{
                                width: "100%",
                                padding: "8px",
                                borderRadius: "8px",
                                border: "none",
                                marginTop: "8px",
                                background: "#8f53c6",
                                color: "white",
                                cursor: "pointer"
                            }}
                        >
                            Buy Game
                        </button>
                    )}
                </div>
            ))}
        </div>

    );
};

export default GameList;
