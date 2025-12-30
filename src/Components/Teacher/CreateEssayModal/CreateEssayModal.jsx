import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { essayService } from "../../../Services/essayService";
import "./CreateEssayModal.css";

export default function CreateEssayModal({ 
  show, 
  onClose, 
  onSuccess, 
  assessmentId 
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!show) {
      setTitle("");
      setDescription("");
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
      const essayData = {
        assessmentId: parseInt(assessmentId),
        title: title.trim(),
        description: description.trim() || null,
      };

      const response = await essayService.createEssay(essayData);
      
      if (response.data?.success) {
        onSuccess?.();
        onClose();
      } else {
        throw new Error(response.data?.message || "Tạo essay thất bại");
      }
    } catch (error) {
      console.error("Error creating essay:", error);
      setErrors({ submit: error.response?.data?.message || error.message || "Có lỗi xảy ra khi tạo essay" });
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
      className="create-essay-modal"
      dialogClassName="create-essay-modal-dialog"
    >
      <Modal.Header closeButton>
        <Modal.Title>Tạo Essay</Modal.Title>
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
              placeholder="Nhập tiêu đề essay"
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
              placeholder="Nhập mô tả essay"
              rows={8}
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

