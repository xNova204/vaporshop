import { collection, addDoc, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

// Firestore collection references
const gamesCollection = collection(db, "games");

// Add a new game
export const addGameToFirestore = async (game: { name: string; price: string; genre: string }) => {
    try {
        await addDoc(gamesCollection, game);
    } catch (err) {
        console.error("Error adding game: ", err);
    }
};

// Fetch all games
export const fetchGamesFromFirestore = async () => {
    try {
        const querySnapshot = await getDocs(gamesCollection);
        return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
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
