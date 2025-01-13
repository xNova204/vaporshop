import React, { useState, useEffect } from 'react';
import GenreList from './components/GenreList';
import GameList from './components/GameList';
import Wishlist from './components/Wishlist';
import Login from './components/Login';
import ManageGames from './components/ManageGames';
import {
    fetchGamesFromFirestore,
    saveWishlistToFirestore,
    fetchWishlistFromFirestore,
    saveInventoryToFirestore,
    fetchInventoryFromFirestore,
    saveRefundRequest,
    fetchPendingRefundRequests,
    approveRefundRequest,
    denyRefundRequest
} from './firebase/firestore';
import { Game, Genre } from './types/types';

const App: React.FC = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [userId, setUserId] = useState<string | null>(null); // Unique ID for the user
    const [role, setRole] = useState<'customer' | 'employee' | null>(null);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
    const [wishlist, setWishlist] = useState<Game[]>([]); // Local wishlist state
    const [inventory, setInventory] = useState<Game[]>([]); // Inventory for customers
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [refundReason, setRefundReason] = useState<string>('');
    const [showRefundPrompt, setShowRefundPrompt] = useState<boolean>(false);
    const [selectedGameForRefund, setSelectedGameForRefund] = useState<Game | null>(null);
    const [refundRequests, setRefundRequests] = useState<{ id: string; userId: string; gameId: string; reason: string }[]>([]);

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
        if (userId && role === 'customer') {
            const fetchUserInventory = async () => {
                const userInventory = await fetchInventoryFromFirestore(userId);
                if (userInventory.length > 0) {
                    setInventory(userInventory);
                }
            };
            fetchUserInventory();

            const fetchUserWishlist = async () => {
                const userWishlist = await fetchWishlistFromFirestore(userId);
                if (userWishlist.length > 0) {
                    setWishlist(userWishlist);
                }
            };
            fetchUserWishlist();
        }
    }, [userId, role]);

    useEffect(() => {
        if (role === 'employee') {
            const fetchRefundRequests = async () => {
                const requests = await fetchPendingRefundRequests();
                setRefundRequests(requests);
            };
            fetchRefundRequests();
        }
    }, [role]);

    useEffect(() => {
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

    const handleAddToInventory = async (game: Game) => {
        if (!inventory.some((item) => item.name === game.name)) {
            // Add the game to the inventory
            const newInventory = [...inventory, game];
            setInventory(newInventory);

            // Save the updated inventory to Firestore
            if (userId) {
                await saveInventoryToFirestore(userId, newInventory);
            }

            // Optionally, remove the game from the wishlist after purchase
            handleRemoveFromWishlist(game);
        }
    };

    const handleRequestRefund = async (game: Game, reason: string) => {
        if (!reason) {
            alert("Please provide a reason for the refund.");
            return;
        }
        await saveRefundRequest(userId!, game.id, reason);
        alert("Your refund request has been submitted and is pending approval.");
        setShowRefundPrompt(false); // Close the refund reason prompt
        setRefundReason(''); // Reset reason
    };

    const handleRefundButtonClick = (game: Game) => {
        setSelectedGameForRefund(game);
        setShowRefundPrompt(true);
    };

    const handleLogin = (role: 'customer' | 'employee', userId: string) => {
        setRole(role);
        setLoggedIn(true);
        setUserId(userId);
    };

    const handleApproveRefund = async (requestId: string, userId: string, gameId: string) => {
        await approveRefundRequest(requestId, userId, gameId);
        setRefundRequests((prevRequests) => prevRequests.filter((req) => req.id !== requestId));
        alert("Refund approved successfully.");
    };

    const handleDenyRefund = async (requestId: string) => {
        await denyRefundRequest(requestId);
        setRefundRequests((prevRequests) => prevRequests.filter((req) => req.id !== requestId));
        alert("Refund denied.");
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
                    <ManageGames
                        genres={genres.map((genre) => genre.name)}
                        onAddGame={() => {}}
                        onRemoveGame={() => {}}
                        games={filteredGames()}
                    />
                    <h2>Pending Refund Requests</h2>
                    <ul>
                        {refundRequests.map((request) => (
                            <li key={request.id}>
                                User ID: {request.userId}, Game ID: {request.gameId}, Reason: {request.reason}
                                <button onClick={() => handleApproveRefund(request.id, request.userId, request.gameId)}>Approve</button>
                                <button onClick={() => handleDenyRefund(request.id)}>Deny</button>
                            </li>
                        ))}
                    </ul>
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
                                onBuyGame={handleAddToInventory}
                            />
                        </>
                    )}
                    <Wishlist
                        games={wishlist}
                        onRemoveFromWishlist={handleRemoveFromWishlist}
                        onBuyGame={handleAddToInventory}
                    />
                    <h2>Your Inventory</h2>
                    <ul>
                        {inventory.map((game) => (
                            <li key={game.id}>
                                {game.name} - {game.price} ({game.genre})
                                <button onClick={() => handleRefundButtonClick(game)}>Request Refund</button>
                            </li>
                        ))}
                    </ul>
                </>
            )}

            {showRefundPrompt && selectedGameForRefund && (
                <div>
                    <h3>Request a Refund for {selectedGameForRefund.name}</h3>
                    <textarea
                        value={refundReason}
                        onChange={(e) => setRefundReason(e.target.value)}
                        placeholder="Please provide a reason for the refund."
                        rows={4}
                        style={{ width: '100%' }}
                    />
                    <button onClick={() => handleRequestRefund(selectedGameForRefund, refundReason)}>Submit Request</button>
                    <button onClick={() => setShowRefundPrompt(false)}>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default App;
