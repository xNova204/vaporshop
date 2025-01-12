import { collection, addDoc, getDocs, doc, deleteDoc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { Game } from "../types/types";  // Import the Game type

// Firestore collection references
const gamesCollection = collection(db, "games");
const wishlistsCollection = collection(db, "wishlists"); // Reference for wishlists

// Add a new game
export const addGameToFirestore = async (game: Omit<Game, 'id'>) => {
    try {
        // Ensure the game object is passed with only the necessary fields (excluding `id`)
        const docRef = await addDoc(collection(db, 'games'), {
            name: game.name,
            genre: game.genre,
            price: game.price, // Ensure price is a string if that's your choice
        });

        console.log("Game added with ID:", docRef.id); // Firestore generates the ID
    } catch (error) {
        console.error("Error adding game: ", error);
    }
};

// Fetch all games
export const fetchGamesFromFirestore = async (): Promise<Game[]> => {
    try {
        const querySnapshot = await getDocs(gamesCollection);
        return querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name,
                price: data.price,
                genre: data.genre,
            } as Game; // Typecast as Game
        });
    } catch (err) {
        console.error("Error fetching games: ", err);
        return [];
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

// Save wishlist to Firestore
export const saveWishlistToFirestore = async (userId: string, wishlist: Game[]) => {
    try {
        const userDoc = doc(wishlistsCollection, userId);
        await setDoc(userDoc, { wishlist });
        console.log("Wishlist saved successfully.");
    } catch (err) {
        console.error("Error saving wishlist: ", err);
    }
};

// Fetch wishlist from Firestore
export const fetchWishlistFromFirestore = async (userId: string): Promise<Game[]> => {
    try {
        const userDoc = doc(wishlistsCollection, userId);
        const docSnap = await getDoc(userDoc);
        if (docSnap.exists()) {
            const data = docSnap.data();
            return data.wishlist || []; // Return wishlist or empty array if not found
        } else {
            return [];
        }
    } catch (err) {
        console.error("Error fetching wishlist: ", err);
        return [];
    }
};

const inventoriesCollection = collection(db, "inventories"); // Reference for customer inventories

// Save inventory to Firestore
export const saveInventoryToFirestore = async (userId: string, inventory: Game[]) => {
    try {
        const userDoc = doc(inventoriesCollection, userId);
        await setDoc(userDoc, { inventory });
        console.log("Inventory saved successfully.");
    } catch (err) {
        console.error("Error saving inventory: ", err);
    }
};

// Fetch inventory from Firestore
export const fetchInventoryFromFirestore = async (userId: string): Promise<Game[]> => {
    try {
        const userDoc = doc(inventoriesCollection, userId);
        const docSnap = await getDoc(userDoc);
        if (docSnap.exists()) {
            const data = docSnap.data();
            return data.inventory || []; // Return inventory or empty array if not found
        } else {
            return [];
        }
    } catch (err) {
        console.error("Error fetching inventory: ", err);
        return [];
    }
};

