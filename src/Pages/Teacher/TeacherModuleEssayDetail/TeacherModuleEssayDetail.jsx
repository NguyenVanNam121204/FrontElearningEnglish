import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import "./TeacherModuleEssayDetail.css";
import TeacherHeader from "../../../Components/Header/TeacherHeader";
import { useAuth } from "../../../Context/AuthContext";
import { teacherService } from "../../../Services/teacherService";
import { essayService } from "../../../Services/essayService";
import { ROUTE_PATHS } from "../../../Routes/Paths";
import SuccessModal from "../../../Components/Common/SuccessModal/SuccessModal";

export default function TeacherModuleEssayDetail() {
  const { courseId, lessonId, moduleId, assessmentId } = useParams();
  const navigate = useNavigate();
  const { user, roles, isAuthenticated } = useAuth();
  const [course, setCourse] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const isTeacher = roles.includes("Teacher") || user?.teacherSubscription?.isTeacher === true;

  useEffect(() => {
    if (!isAuthenticated || !isTeacher) {
      navigate("/home");
      return;
    }

    fetchData();
  }, [isAuthenticated, isTeacher, navigate, courseId, lessonId, moduleId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [courseRes, lessonRes, moduleRes] = await Promise.all([
        teacherService.getCourseDetail(courseId),
        teacherService.getLessonById(lessonId),
        teacherService.getModuleById(moduleId),
      ]);

      if (courseRes.data?.success && courseRes.data?.data) {
        setCourse(courseRes.data.data);
      }

      if (lessonRes.data?.success && lessonRes.data?.data) {
        setLesson(lessonRes.data.data);
      }

      if (moduleRes.data?.success && moduleRes.data?.data) {
        setModule(moduleRes.data.data);
      } else {
        setError("Không thể tải thông tin module");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Không thể tải thông tin");
    } finally {
      setLoading(false);
    }
  };

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
        setShowSuccessModal(true);
        setTimeout(() => {
          navigate(ROUTE_PATHS.TEACHER_LESSON_DETAIL(courseId, lessonId));
        }, 1500);
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

  if (!isAuthenticated || !isTeacher) {
    return null;
  }

  if (loading) {
    return (
      <>
        <TeacherHeader />
        <div className="teacher-module-essay-detail-container">
          <div className="loading-message">Đang tải thông tin...</div>
        </div>
      </>
    );
  }

  if (error || !module) {
    return (
      <>
        <TeacherHeader />
        <div className="teacher-module-essay-detail-container">
          <div className="error-message">{error || "Không tìm thấy module"}</div>
        </div>
      </>
    );
  }

  const courseTitle = course?.title || course?.Title || courseId;
  const lessonTitle = lesson?.title || lesson?.Title || "Bài học";

  return (
    <>
      <TeacherHeader />
      <div className="teacher-module-essay-detail-container">
        <div className="breadcrumb-section">
          <span className="breadcrumb-text">
            <span 
              className="breadcrumb-link"
              onClick={() => navigate(ROUTE_PATHS.TEACHER_COURSE_MANAGEMENT)}
            >
              Quản lý khoá học
            </span>
            {" / "}
            <span 
              className="breadcrumb-link"
              onClick={() => navigate(`/teacher/course/${courseId}`)}
            >
              {courseTitle}
            </span>
            {" / "}
            <span 
              className="breadcrumb-link"
              onClick={() => navigate(ROUTE_PATHS.TEACHER_LESSON_DETAIL(courseId, lessonId))}
            >
              {lessonTitle}
            </span>
            {" / "}
            <span className="breadcrumb-current">Tạo Essay</span>
          </span>
        </div>

        <Container fluid className="create-essay-content">
          <div className="create-essay-card">
            <h1 className="page-title">Tạo Essay</h1>
            
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
                  rows={12}
                />
                <div className="form-hint">Không bắt buộc</div>
              </div>

              {errors.submit && (
                <div className="alert alert-danger mt-3">{errors.submit}</div>
              )}

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate(ROUTE_PATHS.TEACHER_LESSON_DETAIL(courseId, lessonId))}
                  disabled={submitting}
                >
                  Huỷ
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!title.trim() || submitting}
                >
                  {submitting ? "Đang tạo..." : "Tạo"}
                </button>
              </div>
            </form>
          </div>
        </Container>
      </div>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Tạo essay thành công"
        message="Essay của bạn đã được tạo thành công!"
        autoClose={true}
        autoCloseDelay={1500}
      />
    </>
  );
}

