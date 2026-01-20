import React, { useState, useEffect } from 'react';
import GenreList from './components/GenreList';
import GameList from './components/GameList';
import GameDetails from './components/GameDetails';
import Wishlist from './components/Wishlist';
import Login from './components/Login';
import ManageGames from './components/ManageGames';
import { addGameToFirestore, deleteGameFromFirestore } from './firebase/firestore';
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
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase/firebase';

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
    const [wishlistLoaded, setWishlistLoaded] = useState(false);

    // State for selected game and reviews
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);  // New state for selected game
    const [userEmail, setUserEmail] = useState<string>(''); // store email for greeting

    const handleAddGame = async (game: Omit<Game, 'id'>) => {
        try {
            await addGameToFirestore(game); // Add to Firestore
        } catch (error) {
            console.error("Error adding game:", error);
        }
    };


    const getUsername = () => {
        return userEmail ? userEmail.split('@')[0] : '';
    };


    const handleRemoveGame = async (gameId: string) => {
        try {
            // Remove the game from Firestore
            await deleteGameFromFirestore(gameId);

            // Remove the game from the local state (inventory or game list)
            setInventory((prevInventory) => prevInventory.filter((game) => game.id !== gameId));
        } catch (error) {
            console.error("Error removing game:", error);
        }
    };


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
                setWishlist(userWishlist);
                setWishlistLoaded(true);
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
        if (userId && wishlistLoaded) {
            saveWishlistToFirestore(userId, wishlist);
        }
    }, [wishlist, userId, wishlistLoaded]);

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

        // Log the gameId to ensure it's valid
        console.log("Game ID:", game.id);

        try {
            // Check if gameId is present before making the request
            if (!game.id) {
                alert("Game ID is missing.");
                return;
            }

            await saveRefundRequest(userId!, game.id, reason);
            alert("Your refund request has been submitted and is pending approval.");
            setShowRefundPrompt(false); // Close the refund reason prompt
            setRefundReason(''); // Reset reason
        } catch (error) {
            console.error("Error submitting refund request:", error);
            alert("There was an error submitting your refund request. Please try again.");
        }
    };

    const handleRefundButtonClick = (game: Game) => {
        console.log("Selected game for refund:", game);  // Log the game object
        setSelectedGameForRefund(game);
        setShowRefundPrompt(true);
    };

    const handleLogin = async (userId: string, email: string) => {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);

        let role: 'customer' | 'employee' = 'customer';

        if (userSnap.exists()) {
            const data = userSnap.data();

            if (data.role === 'employee') {
                role = 'employee';
            }

            if (!data.role) {
                await setDoc(
                    userRef,
                    {
                        email,
                        role: 'customer',
                        createdAt: new Date(),
                    },
                    { merge: true }
                );
            }
        } else {
            // First login ever
            await setDoc(userRef, {
                email,
                role: 'customer',
                createdAt: new Date(),
            });
        }

        setRole(role);
        setLoggedIn(true);
        setUserId(userId);
        setUserEmail(email);
    };


    const handleApproveRefund = async (requestId: string, userId: string, gameId: string) => {
        await approveRefundRequest(requestId, userId, gameId);
        setRefundRequests((prev) => prev.filter((request) => request.id !== requestId));
    };


    const handleDenyRefund = async (requestId: string) => {
        await denyRefundRequest(requestId);
        setRefundRequests((prev) => prev.filter((request) => request.id !== requestId));
    };

    // Handle selecting a game for details and reviews
    const handleSelectGame = (game: Game) => {
        setSelectedGame(game);
    };

    const filteredGames = () => {
        const query = searchQuery.toLowerCase().trim();

        if (query !== "") {
            // Search across all games, ignoring the genre filter
            return genres.flatMap((genre) =>
                genre.games.filter((game) =>
                    game.name.toLowerCase().includes(query)
                )
            );
        }

        // If a genre is selected, filter by that genre
        if (selectedGenre) {
            const selectedGenreData = genres.find(
                (genre) => genre.name === selectedGenre
            );
            return selectedGenreData ? selectedGenreData.games : [];
        }

        // If no genre is selected (Select), return all games
        return genres.flatMap((genre) => genre.games);
    };

    if (!loggedIn) {
        return <Login onLogin={handleLogin} />;
    }

    const styles: { [key: string]: React.CSSProperties } = {
        container: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            paddingTop: '40px',
            fontFamily: 'Arial, sans-serif',
            background: 'linear-gradient(135deg, #8e44ad, #c39bd3)',
            minHeight: '100vh',
            color: '#fff',
            boxSizing: 'border-box',
            width: '100vw'
        },
        inner: {
            width: '90%',
            maxWidth: '1000px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        },
        searchInput: {
            width: '100%',
            padding: '10px',
            borderRadius: '25px',
            border: '2px solid #6c3483',
            marginBottom: '20px'
        },
        button: {
            padding: '10px 15px',
            margin: '5px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: '#6c3483',
            color: 'white'
        }
    };




    return (
        <div style={styles.container}>
            <div style={{ width: '800px', maxWidth: '95%' }}>

            <h1>Welcome, {role === 'customer' ? getUsername() : 'Employee'}!</h1>

            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Search games..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={styles.searchInput}
                />

            </div>

                {/* Display selected game details */}
                {selectedGame && (
                    <GameDetails game={selectedGame} userId={userId!} />
                )}

                {role === 'employee' && (
                <>
                    <h2>Manage Games</h2>
                    <div>
                        <h3>Select Genre</h3>
                        <select
                            value={selectedGenre || ''}
                            onChange={(e) => setSelectedGenre(e.target.value || null)}
                            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', width: '100%' }}
                        >
                            <option value="">Select</option>
                            {genres.map((genre) => (
                                <option key={genre.id} value={genre.name}>
                                    {genre.name}
                                </option>
                            ))}

                        </select>
                    </div>
                    <ManageGames
                        genres={genres.map((genre) => genre.name)} // Genres for the select dropdown
                        onAddGame={handleAddGame} // Pass add game handler
                        onRemoveGame={handleRemoveGame} // Pass remove game handler
                        games={filteredGames()} // Pass the filtered games
                    />

                    <h2>Pending Refund Requests</h2>
                    <ul>
                        {refundRequests.map((request) => (
                            <li key={request.id}>
                                Game ID: {request.gameId}, User ID: {request.userId}
                                <p>Reason: {request.reason}</p>
                                <button style={styles.button} onClick={() => handleApproveRefund(request.id, request.userId, request.gameId)}>
                                    Approve
                                </button>
                                <button style={styles.button} onClick={() => handleDenyRefund(request.id)}>Deny</button>
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

                        {/* Always show GameList if there are genres */}
                        {genres.length > 0 && (
                            <>
                                {/* Heading: show search info when searching, otherwise show selected genre or "All Games" */}
                                {searchQuery.trim() !== '' ? (
                                    <h2>Search results for "{searchQuery}"</h2>
                                ) : selectedGenre ? (
                                    <h2>Games in {selectedGenre} Genre</h2>
                                ) : (
                                    <h2>All Games</h2>
                                )}

                                <GameList
                                    games={filteredGames()}
                                    onAddToWishlist={addToWishlist}
                                    onBuyGame={handleAddToInventory}
                                    onGameSelect={handleSelectGame}
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
                                    <button style={styles.button} onClick={() => handleRefundButtonClick(game)}>Request Refund</button>
                                </li>
                            ))}
                        </ul>
                    </>
                )}

                {showRefundPrompt && selectedGameForRefund && (
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100vw',
                            height: '100vh',
                            background: 'rgba(0,0,0,0.6)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 9999
                        }}
                    >
                        <div
                            style={{
                                background: '#fff',
                                color: '#000',
                                padding: '20px',
                                borderRadius: '12px',
                                width: '90%',
                                maxWidth: '500px'
                            }}
                        >
                            <h3>Request a Refund for {selectedGameForRefund.name}</h3>

                            <textarea
                                value={refundReason}
                                onChange={(e) => setRefundReason(e.target.value)}
                                placeholder="Please provide a reason for the refund."
                                rows={4}
                                style={{ width: '100%', marginBottom: '10px' }}
                            />

                            <button
                                style={styles.button}
                                onClick={() => handleRequestRefund(selectedGameForRefund, refundReason)}
                            >
                                Submit Request
                            </button>

                            <button
                                style={styles.button}
                                onClick={() => setShowRefundPrompt(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;
