import React from "react";
import { Modal, Button } from "react-bootstrap";
import "./AssessmentTypeSelectionModal.css";

export default function AssessmentTypeSelectionModal({ 
  show, 
  onClose, 
  onSelectEssay, 
  onSelectQuiz 
}) {
  return (
    <Modal 
      show={show} 
      onHide={onClose} 
      centered 
      className="assessment-type-selection-modal"
      dialogClassName="assessment-type-selection-modal-dialog"
    >
      <Modal.Header closeButton>
        <Modal.Title>Chọn loại bài kiểm tra</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="assessment-type-selection-content">
          <p className="selection-description">
            Vui lòng chọn loại bài kiểm tra bạn muốn tạo:
          </p>
          
          <div className="assessment-type-buttons">
            <button 
              className="assessment-type-btn essay-btn"
              onClick={onSelectEssay}
            >
              <div className="btn-icon">📝</div>
              <div className="btn-content">
                <h3>Essay</h3>
                <p>Bài kiểm tra tự luận</p>
              </div>
            </button>
            
            <button 
              className="assessment-type-btn quiz-btn"
              onClick={onSelectQuiz}
            >
              <div className="btn-icon">❓</div>
              <div className="btn-content">
                <h3>Quiz</h3>
                <p>Bài kiểm tra trắc nghiệm</p>
              </div>
            </button>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Huỷ
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

