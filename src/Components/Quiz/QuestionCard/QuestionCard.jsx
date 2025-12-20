import React from "react";
import MultipleChoiceQuestion from "../MultipleChoiceQuestion/MultipleChoiceQuestion";
import MatchingQuestion from "../MatchingQuestion/MatchingQuestion";
import OrderingQuestion from "../OrderingQuestion/OrderingQuestion";
import FillBlankQuestion from "../FillBlankQuestion/FillBlankQuestion";
import TrueFalseQuestion from "../TrueFalseQuestion/TrueFalseQuestion";
import "./QuestionCard.css";

export default function QuestionCard({ question, answer, onChange, questionNumber, totalQuestions }) {
    const renderQuestion = () => {
        if (!question) return null;

        // Handle both camelCase and PascalCase
        const questionType = question.type !== undefined ? question.type : (question.Type !== undefined ? question.Type : 0);

        switch (questionType) {
            case 0: // MultipleChoice
                return (
                    <MultipleChoiceQuestion
                        question={question}
                        answer={answer}
                        onChange={onChange}
                    />
                );
            case 1: // MultipleAnswers
                return (
                    <MultipleChoiceQuestion
                        question={question}
                        answer={answer}
                        onChange={onChange}
                        multiple={true}
                    />
                );
            case 2: // TrueFalse
                return (
                    <TrueFalseQuestion
                        question={question}
                        answer={answer}
                        onChange={onChange}
                    />
                );
            case 3: // FillBlank
                return (
                    <FillBlankQuestion
                        question={question}
                        answer={answer}
                        onChange={onChange}
                    />
                );
            case 4: // Matching
                return (
                    <MatchingQuestion
                        question={question}
                        answer={answer}
                        onChange={onChange}
                    />
                );
            case 5: // Ordering
                return (
                    <OrderingQuestion
                        question={question}
                        answer={answer}
                        onChange={onChange}
                    />
                );
            default:
                return (
                    <MultipleChoiceQuestion
                        question={question}
                        answer={answer}
                        onChange={onChange}
                    />
                );
        }
    };

    if (!question) {
        return (
            <div className="question-card">
                <div className="no-question-message">Không có câu hỏi</div>
            </div>
        );
    }

    return (
        <div className="question-card">
            <div className="question-header">
                <div className="question-number">
                    Câu {questionNumber}/{totalQuestions}
                </div>
                <div className="question-points">
                    {question.points || question.Points || 0} điểm
                </div>
            </div>

            <div className="question-content">
                <div className="question-text">
                    {question.questionText || question.QuestionText || question.stemText || question.StemText || "Câu hỏi"}
                </div>

                {(question.mediaUrl || question.MediaUrl) && (
                    <div className="question-media">
                        {(() => {
                            const mediaUrl = question.mediaUrl || question.MediaUrl;
                            if (mediaUrl.includes('.mp4') || mediaUrl.includes('.webm')) {
                                return <video src={mediaUrl} controls className="media-element" />;
                            } else if (mediaUrl.includes('.mp3') || mediaUrl.includes('.wav')) {
                                return <audio src={mediaUrl} controls className="media-element" />;
                            } else {
                                return <img src={mediaUrl} alt="Question media" className="media-element" />;
                            }
                        })()}
                    </div>
                )}

                <div className="question-answer-section">
                    {renderQuestion()}
                </div>
            </div>
        </div>
    );
}

