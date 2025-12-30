import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import "./TeacherModuleAssessmentDetail.css";
import TeacherHeader from "../../../Components/Header/TeacherHeader";
import { useAuth } from "../../../Context/AuthContext";
import { teacherService } from "../../../Services/teacherService";
import { assessmentService } from "../../../Services/assessmentService";
import { ROUTE_PATHS } from "../../../Routes/Paths";
import SuccessModal from "../../../Components/Common/SuccessModal/SuccessModal";

export default function TeacherModuleAssessmentDetail() {
  const { courseId, lessonId, moduleId } = useParams();
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
  const [timeLimit, setTimeLimit] = useState("");
  const [totalPoints, setTotalPoints] = useState(100);
  const [passingScore, setPassingScore] = useState(60);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdAssessmentId, setCreatedAssessmentId] = useState(null);

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
        const assessmentId = response.data.data?.assessmentId || response.data.data?.AssessmentId;
        setCreatedAssessmentId(assessmentId);
        setShowSuccessModal(true);
        // Sau khi tạo thành công, chuyển đến trang chọn Essay/Quiz
        setTimeout(() => {
          navigate(ROUTE_PATHS.TEACHER_ASSESSMENT_TYPE_SELECTION(courseId, lessonId, moduleId, assessmentId));
        }, 1500);
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

  if (!isAuthenticated || !isTeacher) {
    return null;
  }

  if (loading) {
    return (
      <>
        <TeacherHeader />
        <div className="teacher-module-assessment-detail-container">
          <div className="loading-message">Đang tải thông tin...</div>
        </div>
      </>
    );
  }

  if (error || !module) {
    return (
      <>
        <TeacherHeader />
        <div className="teacher-module-assessment-detail-container">
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
      <div className="teacher-module-assessment-detail-container">
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
            <span className="breadcrumb-current">Tạo Assessment</span>
          </span>
        </div>

        <Container fluid className="create-assessment-content">
          <div className="create-assessment-card">
            <h1 className="page-title">Tạo Assessment</h1>
            
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
                  disabled={!title.trim() || totalPoints <= 0 || passingScore < 0 || passingScore > 100 || submitting}
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
        title="Tạo assessment thành công"
        message="Assessment của bạn đã được tạo thành công!"
        autoClose={true}
        autoCloseDelay={1500}
      />
    </>
  );
}

