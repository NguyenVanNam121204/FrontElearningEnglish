import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import "./TeacherAssessmentTypeSelection.css";
import TeacherHeader from "../../../Components/Header/TeacherHeader";
import { useAuth } from "../../../Context/AuthContext";
import { teacherService } from "../../../Services/teacherService";
import { ROUTE_PATHS } from "../../../Routes/Paths";

export default function TeacherAssessmentTypeSelection() {
  const { courseId, lessonId, moduleId, assessmentId } = useParams();
  const navigate = useNavigate();
  const { user, roles, isAuthenticated } = useAuth();
  const [course, setCourse] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (!isAuthenticated || !isTeacher) {
    return null;
  }

  if (loading) {
    return (
      <>
        <TeacherHeader />
        <div className="teacher-assessment-type-selection-container">
          <div className="loading-message">Đang tải thông tin...</div>
        </div>
      </>
    );
  }

  if (error || !module) {
    return (
      <>
        <TeacherHeader />
        <div className="teacher-assessment-type-selection-container">
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
      <div className="teacher-assessment-type-selection-container">
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
            <span className="breadcrumb-current">Chọn loại bài kiểm tra</span>
          </span>
        </div>

        <Container fluid className="assessment-type-selection-content">
          <div className="assessment-type-selection-card">
            <h1 className="page-title">Chọn loại bài kiểm tra</h1>
            <p className="selection-description">
              Vui lòng chọn loại bài kiểm tra bạn muốn tạo:
            </p>
            
            <div className="assessment-type-buttons">
              <button 
                className="assessment-type-btn essay-btn"
                onClick={() => navigate(ROUTE_PATHS.TEACHER_CREATE_ESSAY(courseId, lessonId, moduleId, assessmentId))}
              >
                <div className="btn-icon">📝</div>
                <div className="btn-content">
                  <h3>Essay</h3>
                  <p>Bài kiểm tra tự luận</p>
                </div>
              </button>
              
              <button 
                className="assessment-type-btn quiz-btn"
                onClick={() => navigate(ROUTE_PATHS.TEACHER_CREATE_QUIZ(courseId, lessonId, moduleId, assessmentId))}
              >
                <div className="btn-icon">❓</div>
                <div className="btn-content">
                  <h3>Quiz</h3>
                  <p>Bài kiểm tra trắc nghiệm</p>
                </div>
              </button>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate(ROUTE_PATHS.TEACHER_LESSON_DETAIL(courseId, lessonId))}
              >
                Quay lại
              </button>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}

