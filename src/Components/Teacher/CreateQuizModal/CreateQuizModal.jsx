import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { quizService } from "../../../Services/quizService";
import "./CreateQuizModal.css";

const QUIZ_TYPES = [
  { value: 1, label: "Practice" },
  { value: 2, label: "MiniTest" },
  { value: 3, label: "FinalExam" },
];

export default function CreateQuizModal({ 
  show, 
  onClose, 
  onSuccess, 
  assessmentId 
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [quizType, setQuizType] = useState(1);
  const [duration, setDuration] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!show) {
      setTitle("");
      setDescription("");
      setQuizType(1);
      setDuration("");
      setErrors({});
    }
  }, [show]);

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = "Tiêu đề là bắt buộc";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const quizData = {
        assessmentId: parseInt(assessmentId),
        title: title.trim(),
        description: description.trim() || null,
        type: quizType,
        status: 1, // Open
        totalQuestions: 0, // Will be updated when questions are added
        duration: duration ? parseInt(duration) : null,
        showAnswersAfterSubmit: true,
        showScoreImmediately: true,
        shuffleQuestions: true,
        shuffleAnswers: true,
        allowUnlimitedAttempts: false,
      };

      const response = await quizService.createQuiz(quizData);
      
      if (response.data?.success) {
        onSuccess?.();
        onClose();
      } else {
        throw new Error(response.data?.message || "Tạo quiz thất bại");
      }
    } catch (error) {
      console.error("Error creating quiz:", error);
      setErrors({ submit: error.response?.data?.message || error.message || "Có lỗi xảy ra khi tạo quiz" });
    } finally {
      setSubmitting(false);
    }
  };

  const isFormValid = title.trim();

  return (
    <Modal 
      show={show} 
      onHide={onClose} 
      centered 
      className="create-quiz-modal"
      dialogClassName="create-quiz-modal-dialog"
    >
      <Modal.Header closeButton>
        <Modal.Title>Tạo Quiz</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label required">Tiêu đề</label>
            <input
              type="text"
              className={`form-control ${errors.title ? "is-invalid" : ""}`}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setErrors({ ...errors, title: null });
              }}
              placeholder="Nhập tiêu đề quiz"
            />
            {errors.title && <div className="invalid-feedback">{errors.title}</div>}
            <div className="form-hint">*Bắt buộc</div>
          </div>

          <div className="form-group">
            <label className="form-label">Mô tả</label>
            <textarea
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập mô tả quiz"
              rows={4}
            />
            <div className="form-hint">Không bắt buộc</div>
          </div>

          <div className="form-group">
            <label className="form-label">Loại quiz</label>
            <select
              className="form-control"
              value={quizType}
              onChange={(e) => setQuizType(parseInt(e.target.value))}
            >
              {QUIZ_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Thời gian làm bài (phút)</label>
            <input
              type="number"
              className="form-control"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Nhập thời gian làm bài (phút)"
              min="0"
            />
            <div className="form-hint">Không bắt buộc</div>
          </div>

          {errors.submit && (
            <div className="alert alert-danger mt-3">{errors.submit}</div>
          )}
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={submitting}>
          Huỷ
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!isFormValid || submitting}
        >
          {submitting ? "Đang tạo..." : "Tạo"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

