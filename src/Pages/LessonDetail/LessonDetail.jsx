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

    const handleModuleClick = async (module) => {
        const rawModuleId = module.moduleId || module.ModuleId;
        if (!rawModuleId) {
            console.error("Module ID is missing");
            return;
        }

        // Parse moduleId thành số để đảm bảo đúng format
        const moduleId = typeof rawModuleId === 'string' ? parseInt(rawModuleId) : rawModuleId;
        if (!moduleId || isNaN(moduleId)) {
            console.error("Invalid module ID:", rawModuleId);
            return;
        }

        // Handle both camelCase and PascalCase
        let contentType = module.contentType || module.ContentType;
        const contentTypeName = (module.contentTypeName || module.ContentTypeName || module.name || module.Name || "").toLowerCase();
        
        // Debug log
        console.log("Module clicked:", {
            moduleId,
            contentType,
            contentTypeName,
            moduleName: module.name || module.Name,
            fullModule: module
        });

        // Convert contentType to number if it's a string or enum
        if (typeof contentType === 'string') {
            // Try to parse as number first
            const parsed = parseInt(contentType);
            if (!isNaN(parsed)) {
                contentType = parsed;
            } else {
                // If it's an enum string like "Assignment", "Quiz", etc.
                const typeLower = contentType.toLowerCase();
                if (typeLower.includes("assignment") || typeLower.includes("quiz") || typeLower.includes("essay") || typeLower.includes("test")) {
                    contentType = 3; // Assignment
                } else if (typeLower.includes("flashcard") || typeLower.includes("flash")) {
                    contentType = 4; // FlashCard
                } else {
                    contentType = 1; // Default to Lecture
                }
            }
        }

        // If contentType is still undefined or null, check contentTypeName or module name
        if (contentType === undefined || contentType === null) {
            // Check module name or contentTypeName for hints
            if (contentTypeName.includes("assignment") || contentTypeName.includes("quiz") || contentTypeName.includes("essay") || contentTypeName.includes("test")) {
                contentType = 3; // Assignment
            } else if (contentTypeName.includes("flashcard") || contentTypeName.includes("flash")) {
                contentType = 4; // FlashCard
            } else {
                contentType = 1; // Default to Lecture
            }
        }

        // Navigate based on ContentType: 1=Lecture, 2=Quiz, 3=Assignment, 4=FlashCard
        // API sẽ được gọi trong LectureDetail/FlashCardDetail/AssignmentDetail để tránh xung đột
        if (contentType === 4 || contentTypeName.includes("flashcard") || contentTypeName.includes("flash")) {
            // Navigate to flashcard detail page
            console.log("Navigating to FlashCard page");
            navigate(`/course/${courseId}/lesson/${lessonId}/module/${moduleId}/flashcards`);
        } else if (contentType === 2 || contentType === 3 || 
                   contentTypeName.includes("quiz") || 
                   contentTypeName.includes("assignment") || 
                   contentTypeName.includes("essay") ||
                   contentTypeName.includes("test")) {
            // Navigate to assignment detail page (Quiz=2, Assignment=3)
            console.log("Navigating to Assignment page");
            navigate(`/course/${courseId}/lesson/${lessonId}/module/${moduleId}/assignment`);
        } else if (contentType === 1 || contentTypeName.includes("lecture")) {
            // Navigate to lecture detail page
            console.log("Navigating to Lecture page");
            navigate(`/course/${courseId}/lesson/${lessonId}/module/${moduleId}`);
        } else {
            // Default: navigate to assignment page (for safety)
            console.log("Default: Navigating to Assignment page");
            navigate(`/course/${courseId}/lesson/${lessonId}/module/${moduleId}/assignment`);
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

