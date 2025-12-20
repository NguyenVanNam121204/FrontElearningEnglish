import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import MainHeader from "../../Components/Header/MainHeader";
import LessonDetailHeader from "../../Components/LessonDetail/LessonDetailHeader/LessonDetailHeader";
import ModuleCard from "../../Components/LessonDetail/ModuleCard/ModuleCard";
import { moduleService } from "../../Services/moduleService";
import { lessonService } from "../../Services/lessonService";
import { courseService } from "../../Services/courseService";
import "./LessonDetail.css";

export default function LessonDetail() {
    const { courseId, lessonId } = useParams();
    const navigate = useNavigate();
    const [modules, setModules] = useState([]);
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

                // Fetch modules
                const modulesResponse = await moduleService.getModulesByLessonId(lessonId);
                if (modulesResponse.data?.success && modulesResponse.data?.data) {
                    const modulesData = modulesResponse.data.data;
                    // Sort by orderIndex
                    const sortedModules = modulesData.sort((a, b) => {
                        const orderA = a.orderIndex || 0;
                        const orderB = b.orderIndex || 0;
                        return orderA - orderB;
                    });
                    setModules(sortedModules);
                } else {
                    setError(modulesResponse.data?.message || "Không thể tải danh sách module");
                }
            } catch (err) {
                console.error("Error fetching lesson detail data:", err);
                setError("Không thể tải dữ liệu bài học");
            } finally {
                setLoading(false);
            }
        };

        if (lessonId) {
            fetchData();
        }
    }, [lessonId]);

    const handleBackClick = () => {
        navigate(`/course/${courseId}/learn`);
    };

    const handleModuleClick = (module) => {
        const moduleId = module.moduleId || module.ModuleId;
        // Handle both camelCase and PascalCase, and convert to number if string
        let contentType = module.contentType || module.ContentType || 1;
        if (typeof contentType === 'string') {
            // Convert string to number if possible
            contentType = parseInt(contentType) || 1;
        }
        
        // Navigate based on ContentType: 1=Lecture, 2=Quiz, 3=Assignment, 4=FlashCard
        if (contentType === 1) {
            // Navigate to lecture detail page
            navigate(`/course/${courseId}/lesson/${lessonId}/module/${moduleId}`);
        } else if (contentType === 4) {
            // Navigate to flashcard detail page
            navigate(`/course/${courseId}/lesson/${lessonId}/module/${moduleId}/flashcards`);
        } else {
            // TODO: Handle other content types (Quiz=2, Assignment=3)
            console.log("Module clicked - other content type:", module, contentType);
            // For now, navigate to lecture detail for other types (can be updated later with specific screens)
            navigate(`/course/${courseId}/lesson/${lessonId}/module/${moduleId}`);
        }
    };

    if (loading) {
        return (
            <>
                <MainHeader />
                <div className="lesson-detail-container">
                    <div className="loading-message">Đang tải...</div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <MainHeader />
                <div className="lesson-detail-container">
                    <div className="error-message">{error}</div>
                </div>
            </>
        );
    }

    const lessonTitle = lesson?.title || lesson?.Title || "Bài học";
    const lessonDescription = lesson?.description || lesson?.Description || "";

    return (
        <>
            <MainHeader />
            <div className="lesson-detail-container">
                <Container>
                    <div className="lesson-detail-breadcrumb">
                        <span onClick={() => navigate("/my-courses")} className="breadcrumb-link">
                            Khóa học của tôi
                        </span>
                        <span className="breadcrumb-separator">/</span>
                        <span onClick={() => navigate(`/course/${courseId}`)} className="breadcrumb-link">
                            {course?.title || course?.Title || "Khóa học"}
                        </span>
                        <span className="breadcrumb-separator">/</span>
                        <span onClick={() => navigate(`/course/${courseId}/learn`)} className="breadcrumb-link">
                            Lesson
                        </span>
                        <span className="breadcrumb-separator">/</span>
                        <span className="breadcrumb-current">{lessonTitle}</span>
                    </div>
                    <LessonDetailHeader
                        title={lessonTitle}
                        description={lessonDescription}
                        onBackClick={handleBackClick}
                    />

                    <div className="modules-list">
                        {modules.length > 0 ? (
                            modules.map((module, index) => {
                                const moduleId = module.moduleId || module.ModuleId;
                                return (
                                    <ModuleCard
                                        key={moduleId || index}
                                        module={module}
                                        onClick={() => handleModuleClick(module)}
                                    />
                                );
                            })
                        ) : (
                            <div className="no-modules-message">Chưa có module nào</div>
                        )}
                    </div>
                </Container>
            </div>
        </>
    );
}

