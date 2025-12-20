import React from "react";
import { FaQuestionCircle } from "react-icons/fa";
import "./QuizCard.css";

export default function QuizCard({ assessment, onClick }) {
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
        <div className="quiz-card" onClick={onClick}>
            <div className="quiz-card-content">
                <div className="quiz-icon-wrapper">
                    <div className="quiz-icon">
                        <FaQuestionCircle />
                    </div>
                </div>
                <div className="quiz-info">
                    <h3 className="quiz-title">{assessment.title}</h3>
                    {assessment.description && (
                        <p className="quiz-description">{assessment.description}</p>
                    )}
                    <div className="quiz-meta">
                        {assessment.timeLimit && (
                            <span className="quiz-meta-item">
                                Thời gian: {formatTimeLimit(assessment.timeLimit)}
                            </span>
                        )}
                        {assessment.totalPoints && (
                            <span className="quiz-meta-item">
                                Điểm: {assessment.totalPoints}
                            </span>
                        )}
                    </div>
                </div>
                <div className="quiz-action">
                    <button 
                        className="quiz-start-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            onClick();
                        }}
                    >
                        Làm Quiz
                    </button>
                </div>
            </div>
        </div>
    );
}

