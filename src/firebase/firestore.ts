import { db } from './firebase'; // Assuming you're using Firebase for the database
import { Game } from '../types/types';
import { doc, getDoc, setDoc, collection, getDocs, query, addDoc } from 'firebase/firestore'; // Updated import for addDoc

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
        games.push(doc.data() as Game);
    });
    return games;
};

// Function to save a refund request to Firestore
export const saveRefundRequest = async (userId: string, gameId: string, reason: string) => {
    await addDoc(collection(db, 'refundRequests'), {
        userId,
        gameId,
        reason,
        status: 'pending',
        createdAt: new Date(),
    });
};
