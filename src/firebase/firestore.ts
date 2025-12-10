import { db } from './firebase'; // Assuming you're using Firebase for the database
import { Game } from '../types/types';
import { doc, getDoc, setDoc, collection, getDocs, query, addDoc, updateDoc, DocumentData, where, deleteDoc} from 'firebase/firestore'; // Updated import for addDoc
import { FirebaseError } from 'firebase/app';



interface RefundRequest {
    id: string;
    userId: string;
    gameId: string;
    reason: string;
    status: 'pending' | 'approved' | 'denied';
    createdAt: Date;
}

// Firestore collection references
const gamesCollection = collection(db, "games");

// Add a new game

// Add a new game to Firestore
export const addGameToFirestore = async (game: Omit<Game, 'id'>) => {
    try {
        const docRef = await addDoc(gamesCollection, game);
        console.log('Game added with ID: ', docRef.id);
    } catch (error) {
        console.error('Error adding game: ', error);
    }
};

// Delete a game
export const deleteGameFromFirestore = async (gameId: string) => {
    try {
        const gameDoc = doc(db, "games", gameId);
        await deleteDoc(gameDoc);
    } catch (err) {
        console.error("Error deleting game: ", err);
    }
};

// Function to save a user's wishlist to Firestore
export const saveWishlistToFirestore = async (userId: string, wishlist: Game[]) => {
    const wishlistRef = doc(db, 'users', userId);
    await setDoc(wishlistRef, { wishlist }, { merge: true });
};

// Function to fetch a user's wishlist from Firestore
export const fetchWishlistFromFirestore = async (userId: string): Promise<Game[]> => {
    const wishlistRef = doc(db, 'users', userId);
    const docSnap = await getDoc(wishlistRef);
    if (docSnap.exists()) {
        return docSnap.data().wishlist || [];
    }
    return [];
};

// Function to save a user's inventory to Firestore
export const saveInventoryToFirestore = async (userId: string, inventory: Game[]) => {
    const inventoryRef = doc(db, 'users', userId);
    await setDoc(inventoryRef, { inventory }, { merge: true });
};

// Function to fetch a user's inventory from Firestore
export const fetchInventoryFromFirestore = async (userId: string): Promise<Game[]> => {
    const inventoryRef = doc(db, 'users', userId);
    const docSnap = await getDoc(inventoryRef);
    if (docSnap.exists()) {
        return docSnap.data().inventory || [];
    }
    return [];
};

// Function to fetch all games from Firestore
export const fetchGamesFromFirestore = async (): Promise<Game[]> => {
    const gamesCollection = collection(db, 'games');
    const q = query(gamesCollection);
    const querySnapshot = await getDocs(q);
    const games: Game[] = [];
    querySnapshot.forEach((doc) => {
        const game = doc.data() as Game;
        game.id = doc.id;  // Ensure the game object includes the ID
        games.push(game);
    });
    return games;
};



// Function to save a refund request to Firestore
export const saveRefundRequest = async (userId: string, gameId: string, reason: string) => {
    try {
        // Ensure gameId is defined before proceeding
        if (!gameId) {
            throw new Error("Game ID is missing.");
        }

        const refundRequestCollection = collection(db, 'refundRequests');
        const newRequest = {
            userId,
            gameId,
            reason,
            status: 'pending',
            createdAt: new Date(),
        };

        // Add new request to Firestore
        const docRef = await addDoc(refundRequestCollection, newRequest);
        console.log("Refund request submitted with ID: ", docRef.id); // Log the ID for debugging
    } catch (error: unknown) {
        if (error instanceof FirebaseError) {
            console.error("Error saving refund request:", error.message); // Specific error message for FirebaseError
            alert("Error saving refund request: " + error.message); // Alert the error message
        } else {
            console.error("Unexpected error:", error); // Catch any non-Firebase errors
            alert("Unexpected error occurred: " + error);
        }
    }
};



// Function to fetch all pending refund requests
export const fetchPendingRefundRequests = async (): Promise<RefundRequest[]> => {
    const refundRequestsCollection = collection(db, 'refundRequests');
    const q = query(refundRequestsCollection); // Fetch all refund requests
    const querySnapshot = await getDocs(q);
    const refundRequests: RefundRequest[] = [];

    querySnapshot.forEach((docSnap) => {
        const data = docSnap.data() as DocumentData;
        refundRequests.push({
            id: docSnap.id,
            userId: data.userId,
            gameId: data.gameId,
            reason: data.reason,
            status: data.status,
            createdAt: data.createdAt.toDate(),
        });
    });

    console.log("Fetched refund requests:", refundRequests); // Log fetched requests for debugging
    return refundRequests.filter((request) => request.status === 'pending'); // Only show pending ones
};


// Function to approve a refund request
export const approveRefundRequest = async (
    requestId: string,
    userId: string,
    gameId: string
): Promise<void> => {
    const refundRequestRef = doc(db, 'refundRequests', requestId);
    const inventoryRef = doc(db, 'users', userId);

    // Update refund request status to 'approved'
    await updateDoc(refundRequestRef, { status: 'approved' });

    // Remove the game from user's inventory
    const userInventorySnap = await getDoc(inventoryRef);
    if (userInventorySnap.exists()) {
        const userInventory = userInventorySnap.data().inventory as Game[];
        const updatedInventory = userInventory.filter((game) => game.id !== gameId);
        await setDoc(inventoryRef, { inventory: updatedInventory }, { merge: true });
    }
};

// Function to deny a refund request
export const denyRefundRequest = async (requestId: string): Promise<void> => {
    const refundRequestRef = doc(db, 'refundRequests', requestId);
    await updateDoc(refundRequestRef, { status: 'denied' });
};

// Add review to Firestore
export const addReviewToFirestore = async (gameId: string, userId: string, review: string, rating: number) => {
    const reviewCollection = collection(db, 'reviews');
    const newReview = {
        gameId,
        userId,
        review,
        rating,
        createdAt: new Date(),
    };

    try {
        const docRef = await addDoc(reviewCollection, newReview);
        console.log("Review submitted with ID: ", docRef.id);
    } catch (error) {
        console.error("Error submitting review: ", error);
    }
};

// Fetch reviews for a specific game
export const fetchReviewsForGame = async (gameId: string) => {
    const reviewsCollection = collection(db, 'reviews');
    const q = query(reviewsCollection, where("gameId", "==", gameId));
    const querySnapshot = await getDocs(q);

    const reviews: { userId: string; username: string; review: string; rating: number; createdAt: Date }[] = [];

    for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data();
        const userId = data.userId;

        // Fetch the user's document to get their email/username
        const userDoc = await getDoc(doc(db, 'users', userId));
        const username = userDoc.exists() ? (userDoc.data().email as string).split('@')[0] : 'Unknown';

        reviews.push({
            userId,
            username,
            review: data.review,
            rating: data.rating,
            createdAt: data.createdAt.toDate(),
        });
    }

    return reviews;
};
