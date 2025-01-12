// src/firebase/firestore.ts
import { db } from './firebase'; // Assuming you're using Firebase for the database
import { Game } from '../types/types';
import { doc, getDoc, setDoc, collection, getDocs, query } from 'firebase/firestore'; // Added `query`

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
    const q = query(gamesCollection); // Using query here
    const querySnapshot = await getDocs(q);
    const games: Game[] = [];
    querySnapshot.forEach((doc) => {
        games.push(doc.data() as Game);
    });
    return games;
};
