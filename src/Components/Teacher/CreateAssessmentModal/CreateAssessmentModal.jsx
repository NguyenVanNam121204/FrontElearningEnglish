import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { assessmentService } from "../../../Services/assessmentService";
import "./CreateAssessmentModal.css";

export default function CreateAssessmentModal({ 
  show, 
  onClose, 
  onSuccess, 
  moduleId 
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timeLimit, setTimeLimit] = useState("");
  const [totalPoints, setTotalPoints] = useState(100);
  const [passingScore, setPassingScore] = useState(60);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!show) {
      setTitle("");
      setDescription("");
      setTimeLimit("");
      setTotalPoints(100);
      setPassingScore(60);
      setErrors({});
    }
  }, [show]);

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = "Tiêu đề là bắt buộc";
    }
    if (totalPoints <= 0) {
      newErrors.totalPoints = "Tổng điểm phải lớn hơn 0";
    }
    if (passingScore < 0 || passingScore > 100) {
      newErrors.passingScore = "Điểm đạt phải từ 0 đến 100";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const assessmentData = {
        moduleId: parseInt(moduleId),
        title: title.trim(),
        description: description.trim() || null,
        timeLimit: timeLimit.trim() || null,
        totalPoints: totalPoints,
        passingScore: passingScore,
        isPublished: false,
      };

      const response = await assessmentService.createAssessment(assessmentData);
      
      if (response.data?.success) {
        onSuccess?.(response.data.data);
        onClose();
      } else {
        throw new Error(response.data?.message || "Tạo assessment thất bại");
      }
    } catch (error) {
      console.error("Error creating assessment:", error);
      setErrors({ submit: error.response?.data?.message || error.message || "Có lỗi xảy ra khi tạo assessment" });
    } finally {
      setSubmitting(false);
    }
  };

  const isFormValid = title.trim() && totalPoints > 0 && passingScore >= 0 && passingScore <= 100;

  return (
    <Modal 
      show={show} 
      onHide={onClose} 
      centered 
      className="create-assessment-modal"
      dialogClassName="create-assessment-modal-dialog"
    >
      <Modal.Header closeButton>
        <Modal.Title>Tạo Assessment</Modal.Title>
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
              placeholder="Nhập tiêu đề assessment"
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
              placeholder="Nhập mô tả assessment"
              rows={4}
            />
            <div className="form-hint">Không bắt buộc</div>
          </div>

          <div className="form-group">
            <label className="form-label">Thời gian giới hạn (HH:MM:SS)</label>
            <input
              type="text"
              className="form-control"
              value={timeLimit}
              onChange={(e) => setTimeLimit(e.target.value)}
              placeholder="Ví dụ: 01:30:00 (1 giờ 30 phút)"
            />
            <div className="form-hint">Không bắt buộc. Định dạng: HH:MM:SS</div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label required">Tổng điểm</label>
              <input
                type="number"
                className={`form-control ${errors.totalPoints ? "is-invalid" : ""}`}
                value={totalPoints}
                onChange={(e) => {
                  setTotalPoints(parseFloat(e.target.value) || 0);
                  setErrors({ ...errors, totalPoints: null });
                }}
                min="0"
                step="0.1"
              />
              {errors.totalPoints && <div className="invalid-feedback">{errors.totalPoints}</div>}
            </div>

            <div className="form-group">
              <label className="form-label required">Điểm đạt (%)</label>
              <input
                type="number"
                className={`form-control ${errors.passingScore ? "is-invalid" : ""}`}
                value={passingScore}
                onChange={(e) => {
                  setPassingScore(parseInt(e.target.value) || 0);
                  setErrors({ ...errors, passingScore: null });
                }}
                min="0"
                max="100"
              />
              {errors.passingScore && <div className="invalid-feedback">{errors.passingScore}</div>}
            </div>
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

