import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import MainHeader from "../../Components/Header/MainHeader";
import FlashCardProgressBar from "../../Components/FlashCardDetail/FlashCardProgressBar/FlashCardProgressBar";
import FlashCardViewer from "../../Components/FlashCardDetail/FlashCardViewer/FlashCardViewer";
import { flashcardService } from "../../Services/flashcardService";
import { moduleService } from "../../Services/moduleService";
import { lessonService } from "../../Services/lessonService";
import { courseService } from "../../Services/courseService";
import "./FlashCardDetail.css";

export default function FlashCardDetail() {
    const { courseId, lessonId, moduleId } = useParams();
    const navigate = useNavigate();
    const [flashcards, setFlashcards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [module, setModule] = useState(null);
    const [lesson, setLesson] = useState(null);
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError("");

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

                // Fetch flashcards
                const flashcardsResponse = await flashcardService.getFlashcardsByModuleId(moduleId);
                if (flashcardsResponse.data?.success && flashcardsResponse.data?.data) {
                    const flashcardsData = flashcardsResponse.data.data;
                    setFlashcards(flashcardsData);
                    if (flashcardsData.length > 0) {
                        setCurrentIndex(0);
                    }
                } else {
                    setError(flashcardsResponse.data?.message || "Không thể tải danh sách flashcard");
                }
            } catch (err) {
                console.error("Error fetching flashcard data:", err);
                setError("Không thể tải dữ liệu flashcard");
            } finally {
                setLoading(false);
            }
        };

        if (moduleId) {
            fetchData();
        }
    }, [moduleId, courseId, lessonId]);

    const handleBackClick = () => {
        navigate(`/course/${courseId}/lesson/${lessonId}`);
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < flashcards.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handleComplete = () => {
        // TODO: Call API to mark flashcard module as completed
        console.log("Complete flashcard module:", moduleId);
        // Navigate back to lesson detail page
        navigate(`/course/${courseId}/lesson/${lessonId}`);
    };

    if (loading) {
        return (
            <>
                <MainHeader />
                <div className="flashcard-detail-container">
                    <div className="loading-message">Đang tải...</div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <MainHeader />
                <div className="flashcard-detail-container">
                    <div className="error-message">{error}</div>
                </div>
            </>
        );
    }

    if (flashcards.length === 0) {
        return (
            <>
                <MainHeader />
                <div className="flashcard-detail-container">
                    <div className="no-flashcards-message">Chưa có flashcard nào</div>
                </div>
            </>
        );
    }

    const currentFlashcard = flashcards[currentIndex];
    const lessonTitle = lesson?.title || lesson?.Title || "Bài học";
    const courseTitle = course?.title || course?.Title || "Khóa học";
    const moduleName = module?.name || module?.Name || "Module";

    return (
        <>
            <MainHeader />
            <div className="flashcard-detail-container">
                <Container>
                    <div className="flashcard-detail-breadcrumb">
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
                </Container>
                <Container className="flashcard-content-container">
                    <FlashCardProgressBar 
                        current={currentIndex + 1} 
                        total={flashcards.length} 
                    />
                    <FlashCardViewer 
                        flashcard={currentFlashcard}
                        onPrevious={handlePrevious}
                        onNext={handleNext}
                        canGoPrevious={currentIndex > 0}
                        canGoNext={currentIndex < flashcards.length - 1}
                        isLastCard={currentIndex === flashcards.length - 1}
                        onComplete={handleComplete}
                    />
                </Container>
            </div>
        </>
    );
}

