import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { FaPlus, FaTrash } from "react-icons/fa";
import "./BulkCreateQuestionsModal.css";

const QUESTION_TYPES = [
    { value: 0, label: "Multiple Choice (Chọn 1 đáp án)" },
    { value: 1, label: "Multiple Answers (Chọn nhiều đáp án)" },
    { value: 2, label: "True/False" },
    { value: 3, label: "Fill in the Blank" },
    { value: 4, label: "Matching" },
    { value: 5, label: "Ordering" },
];

export default function BulkCreateQuestionsModal({ show, onClose, onSubmit }) {
    const [questions, setQuestions] = useState([
        {
            type: 0,
            stemText: "",
            points: 10,
            options: [
                { text: "", isCorrect: true, feedback: "" },
                { text: "", isCorrect: false, feedback: "" },
            ],
        },
    ]);

    const handleAddQuestion = () => {
        setQuestions([
            ...questions,
            {
                type: 0,
                stemText: "",
                points: 10,
                options: [
                    { text: "", isCorrect: true, feedback: "" },
                    { text: "", isCorrect: false, feedback: "" },
                ],
            },
        ]);
    };

    const handleRemoveQuestion = (index) => {
        if (questions.length > 1) {
            setQuestions(questions.filter((_, i) => i !== index));
        }
    };

    const handleQuestionChange = (index, field, value) => {
        const updated = [...questions];
        updated[index] = { ...updated[index], [field]: value };
        setQuestions(updated);
    };

    const handleAddOption = (questionIndex) => {
        const updated = [...questions];
        updated[questionIndex].options.push({
            text: "",
            isCorrect: false,
            feedback: "",
        });
        setQuestions(updated);
    };

    const handleRemoveOption = (questionIndex, optionIndex) => {
        const updated = [...questions];
        if (updated[questionIndex].options.length > 2) {
            updated[questionIndex].options = updated[questionIndex].options.filter(
                (_, i) => i !== optionIndex
            );
            setQuestions(updated);
        }
    };

    const handleOptionChange = (questionIndex, optionIndex, field, value) => {
        const updated = [...questions];
        updated[questionIndex].options[optionIndex] = {
            ...updated[questionIndex].options[optionIndex],
            [field]: value,
        };
        setQuestions(updated);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate all questions
        const errors = [];
        questions.forEach((q, qIndex) => {
            if (!q.stemText.trim()) {
                errors.push(`Câu hỏi ${qIndex + 1}: Nội dung câu hỏi không được để trống`);
            }
            if (q.options.length < 2) {
                errors.push(`Câu hỏi ${qIndex + 1}: Phải có ít nhất 2 đáp án`);
            }
            q.options.forEach((opt, optIndex) => {
                if (!opt.text.trim()) {
                    errors.push(`Câu hỏi ${qIndex + 1}, Đáp án ${optIndex + 1}: Nội dung đáp án không được để trống`);
                }
            });
            // Check if at least one option is correct
            const hasCorrect = q.options.some((opt) => opt.isCorrect);
            if (!hasCorrect) {
                errors.push(`Câu hỏi ${qIndex + 1}: Phải có ít nhất 1 đáp án đúng`);
            }
        });

        if (errors.length > 0) {
            alert("Vui lòng sửa các lỗi sau:\n" + errors.join("\n"));
            return;
        }

        // Prepare questions data for bulk create
        const questionsData = questions.map((q) => {
            // Prepare correctAnswersJson based on question type
            let correctAnswersJson = null;
            if (q.type === 0 || q.type === 1) {
                // Multiple choice or multiple answers - array of option indices
                const correctIndices = q.options
                    .map((opt, idx) => (opt.isCorrect ? idx : null))
                    .filter((idx) => idx !== null);
                correctAnswersJson = JSON.stringify(correctIndices);
            } else if (q.type === 2) {
                // True/False - boolean
                const trueOption = q.options.find((opt) => opt.text.toLowerCase().trim() === "true" || opt.text.toLowerCase().trim() === "đúng");
                correctAnswersJson = JSON.stringify([trueOption?.isCorrect || false]);
            } else {
                // For other types, use indices of correct options
                const correctIndices = q.options
                    .map((opt, idx) => (opt.isCorrect ? idx : null))
                    .filter((idx) => idx !== null);
                correctAnswersJson = JSON.stringify(correctIndices);
            }

            return {
                type: q.type,
                stemText: q.stemText.trim(),
                points: q.points || 10,
                options: q.options.map((opt) => ({
                    text: opt.text.trim(),
                    isCorrect: opt.isCorrect,
                    feedback: opt.feedback?.trim() || null,
                })),
                correctAnswersJson: correctAnswersJson,
                metadataJson: "{}",
                explanation: null,
                mediaTempKey: null,
                mediaType: null,
            };
        });

        onSubmit(questionsData);
    };

    const handleClose = () => {
        // Reset form when closing
        setQuestions([
            {
                type: 0,
                stemText: "",
                points: 10,
                options: [
                    { text: "", isCorrect: true, feedback: "" },
                    { text: "", isCorrect: false, feedback: "" },
                ],
            },
        ]);
        onClose();
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered className="bulk-create-questions-modal">
            <Modal.Header closeButton>
                <Modal.Title>Tạo nhiều câu hỏi cùng lúc</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <div className="questions-list-container">
                        {questions.map((question, qIndex) => (
                            <div key={qIndex} className="question-item-card">
                                <div className="question-item-header">
                                    <h5>Câu hỏi {qIndex + 1}</h5>
                                    {questions.length > 1 && (
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleRemoveQuestion(qIndex)}
                                        >
                                            <FaTrash />
                                        </Button>
                                    )}
                                </div>

                                <Form.Group className="mb-3">
                                    <Form.Label>Loại câu hỏi</Form.Label>
                                    <Form.Select
                                        value={question.type}
                                        onChange={(e) =>
                                            handleQuestionChange(qIndex, "type", parseInt(e.target.value))
                                        }
                                    >
                                        {QUESTION_TYPES.map((type) => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        Nội dung câu hỏi <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={question.stemText}
                                        onChange={(e) =>
                                            handleQuestionChange(qIndex, "stemText", e.target.value)
                                        }
                                        placeholder="Nhập nội dung câu hỏi"
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Điểm số</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="1"
                                        value={question.points}
                                        onChange={(e) =>
                                            handleQuestionChange(qIndex, "points", parseFloat(e.target.value) || 10)
                                        }
                                    />
                                </Form.Group>

                                <div className="options-section">
                                    <div className="options-header">
                                        <Form.Label>Đáp án</Form.Label>
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            onClick={() => handleAddOption(qIndex)}
                                        >
                                            <FaPlus /> Thêm đáp án
                                        </Button>
                                    </div>

                                    {question.options.map((option, optIndex) => (
                                        <div key={optIndex} className="option-item">
                                            <div className="option-content">
                                                <Form.Control
                                                    type="text"
                                                    value={option.text}
                                                    onChange={(e) =>
                                                        handleOptionChange(qIndex, optIndex, "text", e.target.value)
                                                    }
                                                    placeholder={`Đáp án ${optIndex + 1}`}
                                                    required
                                                />
                                                <Form.Check
                                                    type="checkbox"
                                                    label="Đáp án đúng"
                                                    checked={option.isCorrect}
                                                    onChange={(e) =>
                                                        handleOptionChange(qIndex, optIndex, "isCorrect", e.target.checked)
                                                    }
                                                />
                                            </div>
                                            {question.options.length > 2 && (
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={() => handleRemoveOption(qIndex, optIndex)}
                                                >
                                                    <FaTrash />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="add-question-section">
                        <Button variant="outline-primary" onClick={handleAddQuestion}>
                            <FaPlus /> Thêm câu hỏi
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Hủy
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Tạo {questions.length} câu hỏi
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

