// src/types.ts
export interface Game {
    id: string;
    name: string;
    price: string;
    genre: string;
}

export interface Genre {
    id: string;
    name: string;
    games: Game[];
}
