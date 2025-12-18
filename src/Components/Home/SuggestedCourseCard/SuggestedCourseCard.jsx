import React from "react";
import { useNavigate } from "react-router-dom";
import "./SuggestedCourseCard.css";

export default function SuggestedCourseCard({ course }) {
    const navigate = useNavigate();
    const {
        id,
        title = "Khoá học: luyện phát âm",
        skill = "Speaking",
        imageUrl,
    } = course || {};

    const handleClick = () => {
        if (id) {
            navigate(`/course/${id}`);
        }
    };

    return (
        <div className="suggested-course-card" onClick={handleClick}>
            <div className="suggest-icon">
                {imageUrl ? (
                    <img src={imageUrl} alt={title} className="course-image" />
                ) : (
                    <span>📚</span>
                )}
            </div>
            <div className="suggest-text">
                <h4>{title}</h4>
                <span>Kỹ năng: {skill}</span>
            </div>
            <button className="play-btn">▶</button>
        </div>
    );
}

