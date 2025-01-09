import React, { useState } from 'react';
import GenreList from './components/GenreList';
import GameList from './components/GameList';
import Wishlist from './components/Wishlist';
import Login from './components/Login';
import ManageGames from './components/ManageGames';

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
    const initialGenres: Genre[] = [
        {
            id: '1',
            name: 'Action',
            games: [
                { name: 'God of War', price: '$49.99' },
                { name: 'Devil May Cry', price: '$29.99' },
                { name: 'DOOM', price: '$39.99' },
            ],
        },
        {
            id: '2',
            name: 'RPG',
            games: [
                { name: 'The Witcher 3', price: '$39.99' },
                { name: 'Final Fantasy VII', price: '$59.99' },
                { name: 'Skyrim', price: '$19.99' },
            ],
        },
        {
            id: '3',
            name: 'Shooter',
            games: [
                { name: 'Call of Duty', price: '$69.99' },
                { name: 'Halo', price: '$49.99' },
                { name: 'Overwatch', price: '$19.99' },
            ],
        },
    ];

    const [loggedIn, setLoggedIn] = useState(false);
    const [role, setRole] = useState<'customer' | 'employee' | null>(null);
    const [genres, setGenres] = useState<Genre[]>(initialGenres);
    const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
    const [wishlist, setWishlist] = useState<Game[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>(''); // Search query state

    const addToWishlist = (game: Game) => {
        if (!wishlist.some((item) => item.name === game.name)) {
            setWishlist((prevWishlist) => [...prevWishlist, game]);
        }
    };

    const handleRemoveFromWishlist = (game: Game) => {
        setWishlist((prevWishlist) => prevWishlist.filter((item) => item.name !== game.name));
    };

    const handleAddGame = (genreId: string, game: Game) => {
        setGenres((prevGenres) =>
            prevGenres.map((genre) =>
                genre.id === genreId
                    ? { ...genre, games: [...genre.games, game] }
                    : genre
            )
        );
    };

    const handleRemoveGame = (genreId: string, gameName: string) => {
        setGenres((prevGenres) =>
            prevGenres.map((genre) =>
                genre.id === genreId
                    ? { ...genre, games: genre.games.filter((game) => game.name !== gameName) }
                    : genre
            )
        );
    };

    const handleLogin = (role: 'customer' | 'employee') => {
        setRole(role);
        setLoggedIn(true);
    };

    // Filter games within the selected genre based on the search query
    const filteredGames = () => {
        const selectedGenreData = genres.find((genre) => genre.name === selectedGenre);
        return selectedGenreData
            ? selectedGenreData.games.filter((game) =>
                game.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            : [];
    };

    if (!loggedIn) {
        return <Login onLogin={handleLogin} />;
    }

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Welcome, {role === 'customer' ? 'Customer' : 'Employee'}!</h1>

            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Search games..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                    }}
                />
            </div>

            {role === 'employee' && (
                <ManageGames
                    genres={genres}
                    onAddGame={handleAddGame}
                    onRemoveGame={handleRemoveGame}
                />
            )}

            {role === 'customer' && (
                <>
                    <h2>Video Game Genres</h2>
                    <GenreList
                        genres={genres.map((genre) => genre.name)}
                        onGenreSelect={(genre) => setSelectedGenre(genre)}
                        selectedGenre={selectedGenre}
                    />
                    {selectedGenre && (
                        <>
                            <h2>Games in {selectedGenre} Genre</h2>
                            <GameList
                                games={filteredGames()} // Filtered games based on search query
                                onAddToWishlist={addToWishlist}
                            />
                        </>
                    )}
                    <Wishlist
                        games={wishlist}
                        onRemoveFromWishlist={handleRemoveFromWishlist}
                    />
                </>
            )}
        </div>
    );
};

export default App;
