import React, { useState, useEffect } from 'react';
import { Game } from '../types/types';
import { addReviewToFirestore, fetchReviewsForGame } from '../firebase/firestore';

interface Review {
    username: string;
    review: string;
    rating: number;
}

interface GameDetailsProps {
    game: Game;
    userId: string;
}

const GameDetails: React.FC<GameDetailsProps> = ({ game, userId }) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(5);
    const [showReviews, setShowReviews] = useState(false);

    // Fetch reviews for this game
    const fetchReviews = async () => {
        try {
            const reviewsData = await fetchReviewsForGame(game.id);
            setReviews(reviewsData); // use the stored username from Firestore
        } catch (err) {
            console.error("Error fetching reviews:", err);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [game.id]);

    const handleSubmitReview = async () => {
        if (!reviewText.trim()) {
            alert("Please enter a review.");
            return;
        }

        try {
            // Save the review in Firestore with username
            await addReviewToFirestore(game.id, userId, reviewText, rating);

            setReviewText('');
            setRating(5);

            // Refresh reviews to get the stored username
            await fetchReviews();
        } catch (err) {
            console.error("Error submitting review:", err);
        }
    };

    return (
        <div>
            <h3>{game.name}</h3>
            {game.imageUrl && (
                <img src={game.imageUrl} alt={game.name} style={{ width: '200px', marginBottom: '10px' }} />
            )}
            <p>{game.genre}</p>
            <p>{game.price}</p>

            {/* Add review form */}
            <div>
                <textarea
                    value={reviewText}
                    onChange={e => setReviewText(e.target.value)}
                    placeholder="Write your review..."
                    rows={4}
                    style={{ width: '100%' }}
                />
                <div>
                    <label>Rating: </label>
                    <select value={rating} onChange={e => setRating(Number(e.target.value))}>
                        {[1,2,3,4,5].map(num => <option key={num} value={num}>{num}</option>)}
                    </select>
                </div>
                <button onClick={handleSubmitReview}>Submit Review</button>
            </div>

            {/* Toggle reviews */}
            <button onClick={() => setShowReviews(!showReviews)}>
                {showReviews ? "Hide Reviews" : "Show Reviews"}
            </button>

            {showReviews && (
                <div>
                    {reviews.length > 0 ? (
                        <ul>
                            {reviews.map((r, idx) => (
                                <li key={idx}>
                                    <p>{r.review}</p>
                                    <p><strong>Rating:</strong> {r.rating} / 5</p>
                                    <p><strong>By {r.username}</strong></p>
                                    <hr />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No reviews yet for this game.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default GameDetails;
