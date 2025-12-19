import React from "react";
import "./FlashCardProgressBar.css";

export default function FlashCardProgressBar({ current, total }) {
    const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

    return (
        <div className="flashcard-progress-bar">
            <div className="progress-header">
                <span className="progress-label">Số lượng</span>
                <span className="progress-count">{current}/{total}</span>
            </div>
            <div className="progress-track">
                <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );
}

