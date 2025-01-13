// src/components/GameDetails.tsx
import React, { useState, useEffect } from 'react';
import { Game } from '../types/types';
import { addReviewToFirestore, fetchReviewsForGame } from '../firebase/firestore';

interface Review {
    userId: string;
    review: string;
    rating: number;
    createdAt: Date;
}

interface GameDetailsProps {
    game: Game;
    userId: string; // Assume you have a userId prop when logged in as a customer
}

const GameDetails: React.FC<GameDetailsProps> = ({ game, userId }) => {
    const [reviews, setReviews] = useState<Review[]>([]); // To store reviews with specific types
    const [reviewText, setReviewText] = useState<string>('');
    const [rating, setRating] = useState<number>(5); // Default rating 5
    const [showReviews, setShowReviews] = useState<boolean>(false); // Toggle reviews display

    useEffect(() => {
        const fetchReviews = async () => {
            const reviewsData = await fetchReviewsForGame(game.id);
            setReviews(reviewsData);
        };

        fetchReviews();
    }, [game.id]);

    const handleSubmitReview = async () => {
        if (!reviewText) {
            alert("Please enter a review.");
            return;
        }

        try {
            await addReviewToFirestore(game.id, userId, reviewText, rating);
            setReviewText('');
            setRating(5); // Reset rating
            alert("Your review has been submitted.");
            // Re-fetch reviews after submitting
            const updatedReviews = await fetchReviewsForGame(game.id);
            setReviews(updatedReviews);
        } catch (error) {
            console.error("Error submitting review: ", error);
        }
    };

    return (
        <div>
            <h3>{game.name}</h3>
            {/* Removed game.description, as it's not part of the game model anymore */}

            {/* Review Form */}
            <div>
                <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Write your review..."
                    rows={4}
                    style={{ width: '100%' }}
                />
                <div>
                    <label>Rating: </label>
                    <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                    </select>
                </div>
                <button onClick={handleSubmitReview}>Submit Review</button>
            </div>

            {/* Show Reviews Button */}
            <button onClick={() => setShowReviews(!showReviews)}>
                {showReviews ? "Hide Reviews" : "Show Reviews"}
            </button>

            {/* Display Reviews */}
            {showReviews && (
                <div>
                    {reviews.length > 0 ? (
                        <ul>
                            {reviews.map((review, index) => (
                                <li key={index}>
                                    <p>{review.review}</p>
                                    <p><strong>Rating:</strong> {review.rating} / 5</p>
                                    <p><strong>By User {review.userId}</strong></p>
                                    <p><small>Reviewed on {review.createdAt.toLocaleDateString()}</small></p>
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
