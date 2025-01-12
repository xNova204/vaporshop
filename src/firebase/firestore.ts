// src/firebase/firestore.ts
import { collection, addDoc, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { Game } from "../types/types";  // Import the Game type

// Firestore collection references
const gamesCollection = collection(db, "games");


// Add a new game
export const addGameToFirestore = async (game: Omit<Game, "id">): Promise<Game | null> => {
    try {
        const docRef = await addDoc(gamesCollection, game);  // Add the game to Firestore
        const addedGame = { ...game, id: docRef.id };  // Add the Firestore generated ID to the game object
        return addedGame;
    } catch (err) {
        console.error("Error adding game: ", err);
        return null;
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
                genre: data.genre,  // Ensure genre is included
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
