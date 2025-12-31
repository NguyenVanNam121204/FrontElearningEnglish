import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "./CreateEssayModal.css";

export default function CreateEssayModal({ show, onClose, onSubmit }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isPublished, setIsPublished] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!show) {
            // Reset form when modal closes
            setTitle("");
            setDescription("");
            setIsPublished(false);
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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const essayData = {
            title: title.trim(),
            description: description.trim() || null,
            isPublished: isPublished,
        };

        onSubmit(essayData);
    };

    return (
        <Modal show={show} onHide={onClose} centered className="create-essay-modal">
            <Modal.Header closeButton>
                <Modal.Title>Tạo Essay mới</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>
                            Tiêu đề <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            isInvalid={!!errors.title}
                            placeholder="Nhập tiêu đề essay"
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.title}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Mô tả</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Nhập mô tả essay (tùy chọn)"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Check
                            type="checkbox"
                            label="Công khai cho học sinh (Published)"
                            checked={isPublished}
                            onChange={(e) => setIsPublished(e.target.checked)}
                        />
                        <Form.Text className="text-muted">
                            Nếu bật, học sinh sẽ nhìn thấy essay này
                        </Form.Text>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Hủy
                </Button>
                <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={!title.trim()}
                    className="create-essay-submit-btn"
                >
                    Tạo Essay
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
