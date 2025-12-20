import React from "react";
import "./TrueFalseQuestion.css";

export default function TrueFalseQuestion({ question, answer, onChange }) {
    const options = question.options || question.Options || [];
    
    // Find True and False options
    const trueOption = options.find(opt => {
        const text = (opt.optionText || opt.OptionText || opt.text || opt.Text || "").toLowerCase();
        return text.includes("true") || text.includes("đúng");
    }) || options[0]; // Fallback to first option
    
    const falseOption = options.find(opt => {
        const text = (opt.optionText || opt.OptionText || opt.text || opt.Text || "").toLowerCase();
        return text.includes("false") || text.includes("sai");
    }) || options[1]; // Fallback to second option

    const trueOptionId = trueOption ? (trueOption.optionId || trueOption.OptionId || trueOption.answerOptionId || trueOption.AnswerOptionId) : null;
    const falseOptionId = falseOption ? (falseOption.optionId || falseOption.OptionId || falseOption.answerOptionId || falseOption.AnswerOptionId) : null;
    
    const trueText = trueOption ? (trueOption.optionText || trueOption.OptionText || trueOption.text || trueOption.Text || "Đúng") : "Đúng";
    const falseText = falseOption ? (falseOption.optionText || falseOption.OptionText || falseOption.text || falseOption.Text || "Sai") : "Sai";

    const handleChange = (optionId) => {
        onChange(optionId);
    };

    return (
        <div className="true-false-question">
            <div className="true-false-options">
                {trueOptionId && (
                    <div
                        className={`true-false-option ${answer === trueOptionId ? "selected" : ""}`}
                        onClick={() => handleChange(trueOptionId)}
                    >
                        <span className="option-label">{trueText}</span>
                    </div>
                )}
                {falseOptionId && (
                    <div
                        className={`true-false-option ${answer === falseOptionId ? "selected" : ""}`}
                        onClick={() => handleChange(falseOptionId)}
                    >
                        <span className="option-label">{falseText}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

