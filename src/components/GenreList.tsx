import React from 'react';
import { dropdownStyle } from "../styles";

interface GenreListProps {
    genres: string[];
    onGenreSelect: (genre: string | null) => void;
    selectedGenre: string | null;
}

const GenreList: React.FC<GenreListProps> = ({ genres, onGenreSelect, selectedGenre }) => {
    return (
        <div style={{ width: "300px", margin: "20px auto", textAlign: "center" }}>
            <h2 style={{ color: "#fff" }}>Select a Genre</h2>

            <select
                value={selectedGenre ?? ""}
                onChange={(e) => {
                    const value = e.target.value;
                    onGenreSelect(value === "" ? null : value);
                }}
                style={dropdownStyle}
            >
                <option value="">Select</option>
                {genres.map((genre) => (
                    <option key={genre} value={genre}>
                        {genre}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default GenreList;
