// src/App.tsx
import React, { useState } from 'react';
import GenreList from './components/GenreList';
import GameList from './components/GameList';
import Wishlist from './components/Wishlist';

interface Game {
    name: string;
    price: string;
}

interface Genre {
    id: string;
    name: string;
    games: Game[];
}

const App: React.FC = () => {
    const genres: Genre[] = [
        {
            id: '1',
            name: 'Action',
            games: [
                { name: 'God of War', price: '$49.99' },
                { name: 'Devil May Cry', price: '$29.99' },
                { name: 'DOOM', price: '$39.99' }
            ]
        },
        {
            id: '2',
            name: 'RPG',
            games: [
                { name: 'The Witcher 3', price: '$39.99' },
                { name: 'Final Fantasy VII', price: '$59.99' },
                { name: 'Skyrim', price: '$19.99' }
            ]
        },
        {
            id: '3',
            name: 'Shooter',
            games: [
                { name: 'Call of Duty', price: '$69.99' },
                { name: 'Halo', price: '$49.99' },
                { name: 'Overwatch', price: '$19.99' }
            ]
        }
    ];

    const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
    const [wishlist, setWishlist] = useState<Game[]>([]);

    const selectedGames = genres.find((genre) => genre.name === selectedGenre)?.games || [];

    const addToWishlist = (game: Game) => {
        if (!wishlist.some((item) => item.name === game.name)) {
            setWishlist((prevWishlist) => [...prevWishlist, game]);
        }
    };

    const handleRemoveFromWishlist = (game: Game) => {
        setWishlist((prevWishlist) => prevWishlist.filter((item) => item.name !== game.name));
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Vapor</h1>
            <GenreList
                genres={genres.map((genre) => genre.name)}
                onGenreSelect={(genre) => setSelectedGenre(genre)}
                selectedGenre={selectedGenre}
            />
            {selectedGenre && (
                <>
                    <h2>Games in {selectedGenre} Genre</h2>
                    <GameList
                        games={selectedGames}
                        onAddToWishlist={addToWishlist}
                    />
                </>
            )}
            <Wishlist
                games={wishlist}
                onRemoveFromWishlist={handleRemoveFromWishlist}
            />
        </div>
    );
};

export default App;
