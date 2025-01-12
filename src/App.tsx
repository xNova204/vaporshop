import React, { useState, useEffect } from 'react';
import GenreList from './components/GenreList';
import GameList from './components/GameList';
import Wishlist from './components/Wishlist';
import Login from './components/Login';
import ManageGames from './components/ManageGames';
import { fetchGamesFromFirestore } from './firebase/firestore'; // Assuming this is your firestore file
import { Game, Genre } from './types/types'; // Import Game and Genre types from types.ts

const App: React.FC = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [role, setRole] = useState<'customer' | 'employee' | null>(null);
    const [genres, setGenres] = useState<Genre[]>([]);  // State to hold genres
    const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
    const [wishlist, setWishlist] = useState<Game[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>(''); // Search query state

    useEffect(() => {
        const fetchGenres = async () => {
            const games = await fetchGamesFromFirestore();
            const genreMap: { [key: string]: Genre } = {};

            games.forEach((game) => {
                if (!genreMap[game.genre]) {
                    genreMap[game.genre] = { id: game.genre, name: game.genre, games: [] };
                }
                genreMap[game.genre].games.push(game);
            });

            setGenres(Object.values(genreMap)); // Set the genres based on the fetched games
        };

        fetchGenres();
    }, []);

    const addToWishlist = (game: Game) => {
        if (!wishlist.some((item) => item.name === game.name)) {
            setWishlist((prevWishlist) => [...prevWishlist, game]);
        }
    };

    const handleRemoveFromWishlist = (game: Game) => {
        setWishlist((prevWishlist) => prevWishlist.filter((item) => item.name !== game.name));
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
                    onAddGame={() => {}} // Implement add game functionality
                    onRemoveGame={() => {}} // Implement remove game functionality
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