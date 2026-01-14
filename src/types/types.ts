// src/types.ts
export interface Game {
    id: string;
    name: string;
    price: string;
    genre: string;
    imageUrl?: string;
}

export interface Genre {
    id: string;
    name: string;
    games: Game[];
}

export type Review = {
    userId: string;
    review: string;
    rating: number;
};
