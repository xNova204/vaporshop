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

    const fetchReviews = async () => {
        try {
            const reviewsData = await fetchReviewsForGame(game.id);

            const mappedReviews: Review[] = reviewsData.map(r => ({
                username: r.username,
                review: r.review,
                rating: r.rating
            }));

            setReviews(mappedReviews);
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
            await addReviewToFirestore(game.id, userId, reviewText, rating);

            // Optimistic UI update
            setReviews(prev => [
                ...prev,
                {
                    username: userId, // temporary; Firestore will normalize on reload
                    review: reviewText,
                    rating
                }
            ]);

            setReviewText('');
            setRating(5);
        } catch (err) {
            console.error("Error submitting review:", err);
        }
    };

    return (
        <div>
            <h3>{game.name}</h3>

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
                    {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>{num}</option>
                    ))}
                </select>
            </div>

            <button onClick={handleSubmitReview}>Submit Review</button>

            <button onClick={() => setShowReviews(!showReviews)}>
                {showReviews ? "Hide Reviews" : "Show Reviews"}
            </button>

            {showReviews && (
                reviews.length > 0 ? (
                    <ul>
                        {reviews.map((r, idx) => (
                            <li key={idx}>
                                <p>{r.review}</p>
                                <p>Rating: {r.rating} / 5</p>
                                <p><strong>By {r.username}</strong></p>
                                <hr />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No reviews yet for this game.</p>
                )
            )}
        </div>
    );
};

export default GameDetails;
