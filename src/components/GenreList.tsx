// src/components/GenreList.tsx
import React from 'react';

interface GenreListProps {
    genres: string[];
    onGenreSelect: (genre: string) => void;
    selectedGenre: string | null;
}

const GenreList: React.FC<GenreListProps> = ({ genres, onGenreSelect, selectedGenre }) => {
    return (
        <div>
            <h2>Select a Genre</h2>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {genres.map((genre) => (
                    <li
                        key={genre}
                        onClick={() => onGenreSelect(genre)}
                        style={{
                            cursor: 'pointer',
                            padding: '10px 15px',
                            margin: '5px 0',
                            borderRadius: '5px',
                            backgroundColor: genre === selectedGenre ? '#4caf50' : '#f0f0f0',
                            color: genre === selectedGenre ? '#ffffff' : '#000000',
                            transition: 'background-color 0.3s',
                        }}
                    >
                        {genre}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GenreList;
