import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./CourseDetail.css";
import MainHeader from "../../Components/Header/MainHeader";
import CourseBanner from "../../Components/Courses/CourseBanner/CourseBanner";
import CourseInfo from "../../Components/Courses/CourseInfo/CourseInfo";
import CourseSummaryCard from "../../Components/Courses/CourseSummaryCard/CourseSummaryCard";
import { courseService } from "../../Services/courseService";
import { enrollmentService } from "../../Services/enrollmentService";
import { mochiKhoaHoc as mochiKhoaHocImage } from "../../Assets";

export default function CourseDetail() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCourseDetail = async () => {
            try {
                setLoading(true);
                setError("");
                const response = await courseService.getCourseById(courseId);
                
                if (response.data?.success && response.data?.data) {
                    const courseData = response.data.data;
                    setCourse({
                        ...courseData,
                        imageUrl: courseData.imageUrl && courseData.imageUrl.trim() !== "" 
                            ? courseData.imageUrl 
                            : mochiKhoaHocImage,
                    });
                } else {
                    setError("Không tìm thấy khóa học");
                }
            } catch (err) {
                console.error("Error fetching course detail:", err);
                setError("Không thể tải thông tin khóa học");
            } finally {
                setLoading(false);
            }
        };

        if (courseId) {
            fetchCourseDetail();
        }
    }, [courseId]);

    const handleEnroll = async () => {
        try {
            // Navigate to enrollment or payment if needed
            navigate(`/course/${courseId}/enroll`);
        } catch (err) {
            console.error("Error enrolling:", err);
        }
    };

    const handleStartLearning = () => {
        // Navigate to course learning page
        navigate(`/course/${courseId}/learn`);
    };

    const handleUnenroll = async () => {
        if (window.confirm("Bạn có chắc chắn muốn hủy đăng ký khóa học này?")) {
            try {
                await enrollmentService.unenroll(courseId);
                // Refresh course data to update enrollment status
                const response = await courseService.getCourseById(courseId);
                if (response.data?.success && response.data?.data) {
                    const courseData = response.data.data;
                    setCourse({
                        ...courseData,
                        imageUrl: courseData.imageUrl && courseData.imageUrl.trim() !== "" 
                            ? courseData.imageUrl 
                            : mochiKhoaHocImage,
                    });
                }
            } catch (err) {
                console.error("Error unenrolling:", err);
                alert("Không thể hủy đăng ký khóa học. Vui lòng thử lại.");
            }
        }
    };

    if (loading) {
        return (
            <>
                <MainHeader />
                <div className="course-detail-container">
                    <div className="loading-message">Đang tải thông tin khóa học...</div>
                </div>
            </>
        );
    }

    if (error || !course) {
        return (
            <>
                <MainHeader />
                <div className="course-detail-container">
                    <div className="error-message">{error || "Không tìm thấy khóa học"}</div>
                </div>
            </>
        );
    }

    return (
        <>
            <MainHeader />
            <div className="course-detail-container">
                <div className="course-breadcrumb">
                    <span onClick={() => navigate("/my-courses")} className="breadcrumb-link">
                        Khoá học của tôi
                    </span>
                    <span className="breadcrumb-separator">/</span>
                    <span className="breadcrumb-current">{course.title}</span>
                </div>

                <CourseBanner 
                    title={course.title}
                   
                />

                <div className="course-content">
                    <div className="course-content-left">
                        <CourseInfo course={course} />
                    </div>
                    <div className="course-content-right">
                        <CourseSummaryCard 
                            course={course}
                            onEnroll={handleEnroll}
                            onStartLearning={handleStartLearning}
                            onUnenroll={handleUnenroll}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

