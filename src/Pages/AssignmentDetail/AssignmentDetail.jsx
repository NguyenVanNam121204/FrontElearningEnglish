import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import MainHeader from "../../Components/Header/MainHeader";
import QuizCard from "../../Components/Assignment/QuizCard/QuizCard";
import EssayCard from "../../Components/Assignment/EssayCard/EssayCard";
import AssessmentInfoModal from "../../Components/Assignment/AssessmentInfoModal/AssessmentInfoModal";
import NotificationModal from "../../Components/Common/NotificationModal/NotificationModal";
import { assessmentService } from "../../Services/assessmentService";
import { moduleService } from "../../Services/moduleService";
import { courseService } from "../../Services/courseService";
import { lessonService } from "../../Services/lessonService";
import { quizAttemptService } from "../../Services/quizAttemptService";
import { essayService } from "../../Services/essayService";
import { quizService } from "../../Services/quizService";
import "./AssignmentDetail.css";

export default function AssignmentDetail() {
    const { courseId, lessonId, moduleId } = useParams();
    const navigate = useNavigate();
    const [assessments, setAssessments] = useState([]);
    const [module, setModule] = useState(null);
    const [lesson, setLesson] = useState(null);
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedAssessment, setSelectedAssessment] = useState(null);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [notification, setNotification] = useState({ isOpen: false, type: "info", message: "" });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError("");

                // Gọi API hoàn thành module khi vào trang assignment
                const parsedModuleId = typeof moduleId === 'string' ? parseInt(moduleId) : moduleId;
                if (parsedModuleId && !isNaN(parsedModuleId)) {
                    try {
                        await moduleService.startModule(parsedModuleId);
                        console.log(`Module ${parsedModuleId} started successfully`);
                    } catch (err) {
                        console.error("Error starting module:", err);
                    }
                }

                // Fetch course info
                const courseResponse = await courseService.getCourseById(courseId);
                if (courseResponse.data?.success && courseResponse.data?.data) {
                    setCourse(courseResponse.data.data);
                }

                // Fetch lesson info
                const lessonResponse = await lessonService.getLessonById(lessonId);
                if (lessonResponse.data?.success && lessonResponse.data?.data) {
                    setLesson(lessonResponse.data.data);
                }

                // Fetch module info
                const moduleResponse = await moduleService.getModuleById(moduleId);
                if (moduleResponse.data?.success && moduleResponse.data?.data) {
                    setModule(moduleResponse.data.data);
                }

                // Fetch assessments
                const assessmentsResponse = await assessmentService.getByModule(moduleId);
                if (assessmentsResponse.data?.success && assessmentsResponse.data?.data) {
                    setAssessments(assessmentsResponse.data.data);
                } else {
                    setError(assessmentsResponse.data?.message || "Không thể tải danh sách bài tập");
                }
            } catch (err) {
                console.error("Error fetching assignment data:", err);
                setError("Không thể tải dữ liệu bài tập");
            } finally {
                setLoading(false);
            }
        };

        if (moduleId) {
            fetchData();
        }
    }, [moduleId, courseId, lessonId]);

    // Phân loại assessments thành Quiz và Essay dựa trên title
    // Có thể một assessment có cả quiz và essay, nên phân loại dựa trên title
    const quizzes = assessments.filter(a => {
        const titleLower = a.title?.toLowerCase() || "";
        return titleLower.includes("quiz") || titleLower.includes("test") || titleLower.includes("kiểm tra");
    });
    const essays = assessments.filter(a => {
        const titleLower = a.title?.toLowerCase() || "";
        return titleLower.includes("essay") || titleLower.includes("luận") || titleLower.includes("viết");
    });

    const handleQuizClick = (assessment) => {
        setSelectedAssessment(assessment);
        setShowInfoModal(true);
    };

    const handleEssayClick = (assessment) => {
        setSelectedAssessment(assessment);
        setShowInfoModal(true);
    };

    const handleStartQuiz = async (assessmentData) => {
        try {
            // If attemptId is already provided from modal, use it
            if (assessmentData.attemptId && assessmentData.quizId) {
                navigate(`/course/${courseId}/lesson/${lessonId}/module/${moduleId}/quiz/${assessmentData.quizId}/attempt/${assessmentData.attemptId}`);
                return;
            }

            // Otherwise, get quiz and start attempt
            const quizResponse = await quizService.getByAssessment(assessmentData.assessmentId);
            if (quizResponse.data?.success && quizResponse.data?.data && quizResponse.data.data.length > 0) {
                const quiz = quizResponse.data.data[0];
                const quizId = quiz.quizId || quiz.QuizId;
                
                // Start quiz attempt
                const attemptResponse = await quizAttemptService.start(quizId);
                if (attemptResponse.data?.success && attemptResponse.data?.data) {
                    const attemptId = attemptResponse.data.data.attemptId || attemptResponse.data.data.AttemptId;
                    // Navigate to quiz page với attemptId
                    navigate(`/course/${courseId}/lesson/${lessonId}/module/${moduleId}/quiz/${quizId}/attempt/${attemptId}`);
                } else {
                    setNotification({
                        isOpen: true,
                        type: "error",
                        message: attemptResponse.data?.message || "Không thể bắt đầu làm quiz"
                    });
                }
            }
        } catch (err) {
            console.error("Error starting quiz:", err);
            setNotification({
                isOpen: true,
                type: "error",
                message: err.response?.data?.message || "Không thể bắt đầu làm quiz"
            });
        }
    };

    const handleStartEssay = async (assessment) => {
        // Chỉ hiển thị thông báo, không navigate
        console.log("Start essay for assessment:", assessment);
        // TODO: Có thể thêm logic khác ở đây nếu cần
    };

    const handleBackClick = () => {
        navigate(`/course/${courseId}/lesson/${lessonId}`);
    };

    if (loading) {
        return (
            <>
                <MainHeader />
                <div className="assignment-detail-container">
                    <div className="loading-message">Đang tải...</div>
                </div>
            </>
        );
    }

    if (error && assessments.length === 0) {
        return (
            <>
                <MainHeader />
                <div className="assignment-detail-container">
                    <div className="error-message">{error}</div>
                </div>
            </>
        );
    }

    const moduleName = module?.name || module?.Name || "Assignment";
    const lessonTitle = lesson?.title || lesson?.Title || "Bài học";
    const courseTitle = course?.title || course?.Title || "Khóa học";

    return (
        <>
            <MainHeader />
            <div className="assignment-detail-container">
                <Container fluid>
                    <Row>
                        <Col>
                            <div className="assignment-breadcrumb">
                                <span onClick={() => navigate("/my-courses")} className="breadcrumb-link">
                                    Khóa học của tôi
                                </span>
                                <span className="breadcrumb-separator">/</span>
                                <span onClick={() => navigate(`/course/${courseId}`)} className="breadcrumb-link">
                                    {courseTitle}
                                </span>
                                <span className="breadcrumb-separator">/</span>
                                <span onClick={() => navigate(`/course/${courseId}/learn`)} className="breadcrumb-link">
                                    Lesson
                                </span>
                                <span className="breadcrumb-separator">/</span>
                                <span onClick={() => navigate(`/course/${courseId}/lesson/${lessonId}`)} className="breadcrumb-link">
                                    {lessonTitle}
                                </span>
                                <span className="breadcrumb-separator">/</span>
                                <span className="breadcrumb-current">{moduleName}</span>
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <div className="assignment-header">
                                <h1 className="assignment-title">{moduleName}</h1>
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col lg={6}>
                            {quizzes.length > 0 && (
                                <div className="assignment-section">
                                    <h2 className="section-title">Quiz</h2>
                                    <div className="assessment-cards">
                                        {quizzes.map((assessment) => (
                                            <QuizCard
                                                key={assessment.assessmentId}
                                                assessment={assessment}
                                                onClick={() => handleQuizClick(assessment)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </Col>
                        <Col lg={6}>
                            {essays.length > 0 && (
                                <div className="assignment-section">
                                    <h2 className="section-title">Essay</h2>
                                    <div className="assessment-cards">
                                        {essays.map((assessment) => (
                                            <EssayCard
                                                key={assessment.assessmentId}
                                                assessment={assessment}
                                                onClick={() => handleEssayClick(assessment)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </Col>
                    </Row>

                    {quizzes.length === 0 && essays.length === 0 && (
                        <Row>
                            <Col>
                                <div className="no-assessments-message">
                                    Chưa có bài tập nào trong module này.
                                </div>
                            </Col>
                        </Row>
                    )}
                </Container>
            </div>

            <AssessmentInfoModal
                isOpen={showInfoModal}
                onClose={() => {
                    setShowInfoModal(false);
                    setSelectedAssessment(null);
                }}
                assessment={selectedAssessment}
                onStartQuiz={handleStartQuiz}
                onStartEssay={handleStartEssay}
            />

            <NotificationModal
                isOpen={notification.isOpen}
                onClose={() => setNotification({ ...notification, isOpen: false })}
                type={notification.type}
                message={notification.message}
            />
        </>
    );
}

