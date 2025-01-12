import React, { useState, useEffect } from 'react';
import GenreList from './components/GenreList';
import GameList from './components/GameList';
import Wishlist from './components/Wishlist';
import Login from './components/Login';
import ManageGames from './components/ManageGames'; // Re-import ManageGames
import { fetchGamesFromFirestore, saveWishlistToFirestore, fetchWishlistFromFirestore } from './firebase/firestore';
import { Game, Genre } from './types/types';

const App: React.FC = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [userId, setUserId] = useState<string | null>(null); // Unique ID for the user
    const [role, setRole] = useState<'customer' | 'employee' | null>(null);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
    const [wishlist, setWishlist] = useState<Game[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');

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

            setGenres(Object.values(genreMap));
        };

        fetchGenres();
    }, []);

    useEffect(() => {
        // Fetch games from Firestore when logged in as employee
        if (role === 'employee') {
            // We no longer need to store the fetched games in a variable.
            // If you need to process them later, you can filter them directly in the filteredGames function.
        }
    }, [role]);

    useEffect(() => {
        // Only fetch the wishlist when the user logs in for the first time
        if (userId && wishlist.length === 0) {
            const fetchUserWishlist = async () => {
                const userWishlist = await fetchWishlistFromFirestore(userId);
                if (userWishlist.length > 0) {
                    setWishlist(userWishlist);
                }
            };
            fetchUserWishlist();
        }
    }, [userId]);

    useEffect(() => {
        // Save the wishlist to Firestore whenever it changes
        if (userId && wishlist.length > 0) {
            saveWishlistToFirestore(userId, wishlist);
        }
    }, [wishlist, userId]);

    const addToWishlist = (game: Game) => {
        if (!wishlist.some((item) => item.name === game.name)) {
            setWishlist((prevWishlist) => [...prevWishlist, game]);
        }
    };

    const handleRemoveFromWishlist = (game: Game) => {
        setWishlist((prevWishlist) => prevWishlist.filter((item) => item.name !== game.name));
    };

    const handleLogin = (role: 'customer' | 'employee', userId: string) => {
        setRole(role);
        setLoggedIn(true);
        setUserId(userId);
    };

    const filteredGames = () => {
        const selectedGenreData = genres.find((genre) => genre.name === selectedGenre);
        return selectedGenreData
            ? selectedGenreData.games.filter((game) =>
                game.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            : [];
    };

    if (!loggedIn) {
        return <Login onLogin={(role, userId) => handleLogin(role, userId)} />;
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
                <>
                    <h2>Manage Games</h2>
                    <div>
                        <h3>Select Genre</h3>
                        <select
                            value={selectedGenre || ''}
                            onChange={(e) => setSelectedGenre(e.target.value)}
                            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', width: '100%' }}
                        >
                            <option value="">All Genres</option>
                            {genres.map((genre) => (
                                <option key={genre.id} value={genre.name}>
                                    {genre.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <ManageGames
                        genres={genres.map((genre) => genre.name)}
                        onAddGame={() => {}}
                        onRemoveGame={() => {}}
                        games={filteredGames()}
                    />
                </>
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
                                games={filteredGames()}
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
