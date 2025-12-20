import React from "react";
import { FaEdit } from "react-icons/fa";
import "./EssayCard.css";

export default function EssayCard({ assessment, onClick }) {
    const formatTimeLimit = (timeLimit) => {
        if (!timeLimit) return "Không giới hạn";
        // timeLimit format: "00:35:00" (HH:mm:ss)
        const parts = timeLimit.split(":");
        if (parts.length === 3) {
            const hours = parseInt(parts[0]);
            const minutes = parseInt(parts[1]);
            if (hours > 0) {
                return `${hours} giờ ${minutes} phút`;
            }
            return `${minutes} phút`;
        }
        return timeLimit;
    };

    return (
        <div className="essay-card" onClick={onClick}>
            <div className="essay-card-content">
                <div className="essay-icon-wrapper">
                    <div className="essay-icon">
                        <FaEdit />
                    </div>
                </div>
                <div className="essay-info">
                    <h3 className="essay-title">{assessment.title}</h3>
                    {assessment.description && (
                        <p className="essay-description">{assessment.description}</p>
                    )}
                    <div className="essay-meta">
                        {assessment.timeLimit && (
                            <span className="essay-meta-item">
                                Thời gian: {formatTimeLimit(assessment.timeLimit)}
                            </span>
                        )}
                        {assessment.totalPoints && (
                            <span className="essay-meta-item">
                                Điểm: {assessment.totalPoints}
                            </span>
                        )}
                    </div>
                </div>
                <div className="essay-action">
                    <button 
                        className="essay-start-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            onClick();
                        }}
                    >
                        <FaEdit />
                        <span>Bắt đầu Viết Essay</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

