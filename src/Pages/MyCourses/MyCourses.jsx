import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MyCourses.css";
import MainHeader from "../../Components/Header/MainHeader";
import JoinClassModal from "../../Components/Common/JoinClassModal/JoinClassModal";
import NotificationModal from "../../Components/Common/NotificationModal/NotificationModal";
import RegisteredCourseCard from "../../Components/Courses/RegisteredCourseCard/RegisteredCourseCard";
import PublicCourseCard from "../../Components/Courses/PublicCourseCard/PublicCourseCard";
import { FaSearch, FaPlus } from "react-icons/fa";
import { enrollmentService } from "../../Services/enrollmentService";
import { courseService } from "../../Services/courseService";
import { mochiKhoaHoc as mochiKhoaHocImage } from "../../Assets";

export default function MyCourses() {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [registeredCourses, setRegisteredCourses] = useState([]);
    const [publicCourses, setPublicCourses] = useState([]);
    const [filteredRegisteredCourses, setFilteredRegisteredCourses] = useState([]);
    const [filteredPublicCourses, setFilteredPublicCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [notification, setNotification] = useState({
        isOpen: false,
        type: "info", // "success", "error", "info"
        message: ""
    });

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                setError("");

                // 1. Lấy danh sách khóa học đã đăng ký
                const registeredRes = await enrollmentService.getMyCourses();
                const registeredData = registeredRes.data?.data || [];

                const mappedRegisteredCourses = registeredData.map((course) => ({
                    id: course.courseId,
                    title: course.title,
                    imageUrl: course.imageUrl && course.imageUrl.trim() !== ""
                        ? course.imageUrl
                        : mochiKhoaHocImage,
                    progress: Math.round(course.progressPercentage || 0),
                }));

                // 2. Lấy danh sách khóa học hệ thống và lọc chỉ lấy isFeatured = true
                const publicRes = await courseService.getSystemCourses();
                const publicData = publicRes.data?.data || [];

                const featuredCourses = publicData.filter(
                    (course) => course.isFeatured === true
                );

                const mappedPublicCourses = featuredCourses.map((course) => ({
                    id: course.courseId,
                    courseId: course.courseId,
                    title: course.title,
                    imageUrl: course.imageUrl && course.imageUrl.trim() !== ""
                        ? course.imageUrl
                        : mochiKhoaHocImage,
                }));

                setRegisteredCourses(mappedRegisteredCourses);
                setPublicCourses(mappedPublicCourses);
                // Initialize filtered courses
                setFilteredRegisteredCourses(mappedRegisteredCourses);
                setFilteredPublicCourses(mappedPublicCourses);
            } catch (err) {
                console.error("Error fetching courses:", err);
                setError("Không thể tải danh sách khóa học");
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    // Filter courses based on search query - vừa tìm kiếm local vừa gọi API
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredRegisteredCourses(registeredCourses);
            setFilteredPublicCourses(publicCourses);
            return;
        }

        const searchCourses = async () => {
            try {
                // Gọi API search
                const response = await courseService.searchCourses(searchQuery.trim());
                if (response.data?.success && response.data?.data) {
                    const searchResults = response.data.data;

                    // Map search results
                    const mappedSearchResults = searchResults.map((course) => ({
                        id: course.courseId,
                        courseId: course.courseId,
                        title: course.title,
                        imageUrl: course.imageUrl && course.imageUrl.trim() !== ""
                            ? course.imageUrl
                            : mochiKhoaHocImage,
                    }));

                    // Tìm trong registered courses xem có course nào match không
                    const matchedRegistered = registeredCourses.filter((course) =>
                        searchResults.some((result) => result.courseId === course.id)
                    );

                    // Public courses từ search results
                    const matchedPublic = mappedSearchResults.filter((course) =>
                        !matchedRegistered.some((reg) => reg.id === course.id)
                    );

                    setFilteredRegisteredCourses(matchedRegistered);
                    setFilteredPublicCourses(matchedPublic);
                } else {
                    // Fallback: local filtering nếu API fails
                    const localFilteredRegistered = registeredCourses.filter((course) =>
                        course.title?.toLowerCase().includes(searchQuery.toLowerCase())
                    );
                    const localFilteredPublic = publicCourses.filter((course) =>
                        course.title?.toLowerCase().includes(searchQuery.toLowerCase())
                    );
                    setFilteredRegisteredCourses(localFilteredRegistered);
                    setFilteredPublicCourses(localFilteredPublic);
                }
            } catch (err) {
                console.error("Error searching courses:", err);
                // Fallback: local filtering nếu API fails
                const localFilteredRegistered = registeredCourses.filter((course) =>
                    course.title?.toLowerCase().includes(searchQuery.toLowerCase())
                );
                const localFilteredPublic = publicCourses.filter((course) =>
                    course.title?.toLowerCase().includes(searchQuery.toLowerCase())
                );
                setFilteredRegisteredCourses(localFilteredRegistered);
                setFilteredPublicCourses(localFilteredPublic);
            }
        };

        const debounceTimer = setTimeout(() => {
            searchCourses();
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [searchQuery, registeredCourses, publicCourses]);

    const handleJoinClass = async (classCode) => {
        try {
            const response = await enrollmentService.joinByClassCode({ classCode });

            // Function to find course by classCode and navigate
            const findAndNavigateToCourse = async () => {
                try {
                    // Search all system courses to find one with matching classCode
                    const systemCoursesResponse = await courseService.getSystemCourses();
                    if (systemCoursesResponse.data?.success && systemCoursesResponse.data?.data) {
                        const allSystemCourses = systemCoursesResponse.data.data;
                        const foundCourse = allSystemCourses.find(c => c.classCode === classCode);
                        if (foundCourse) {
                            // Navigate to course detail
                            navigate(`/course/${foundCourse.courseId}`);
                            return true;
                        }
                    }
                    return false;
                } catch (err) {
                    console.error("Error finding course:", err);
                    return false;
                }
            };

            if (response.data?.success) {
                // Join thành công
                setIsModalOpen(false);
                setNotification({
                    isOpen: true,
                    type: "success",
                    message: "Đã join khóa học thành công!"
                });

                // Find and navigate to course
                const found = await findAndNavigateToCourse();
                if (!found) {
                    // Fallback: get my courses and navigate to latest
                    try {
                        const myCoursesResponse = await enrollmentService.getMyCourses();
                        if (myCoursesResponse.data?.success && myCoursesResponse.data?.data?.length > 0) {
                            const myCourses = myCoursesResponse.data.data;
                            const latestCourse = myCourses[myCourses.length - 1];
                            navigate(`/course/${latestCourse.courseId}`);
                        }
                    } catch (err) {
                        console.error("Error getting my courses:", err);
                    }
                }

                // Refresh courses list
                const registeredRes = await enrollmentService.getMyCourses();
                const registeredData = registeredRes.data?.data || [];
                const mappedRegisteredCourses = registeredData.map((course) => ({
                    id: course.courseId,
                    title: course.title,
                    imageUrl: course.imageUrl && course.imageUrl.trim() !== ""
                        ? course.imageUrl
                        : mochiKhoaHocImage,
                    progress: Math.round(course.progressPercentage || 0),
                }));
                setRegisteredCourses(mappedRegisteredCourses);
                // Update filtered courses if no search query
                if (!searchQuery.trim()) {
                    setFilteredRegisteredCourses(mappedRegisteredCourses);
                }
            } else {
                // Join thất bại - kiểm tra xem có phải "đã đăng ký rồi" không
                const errorMessage = response.data?.message || "";
                const isAlreadyEnrolled = errorMessage.includes("đã đăng ký") || errorMessage.includes("đã tham gia");

                if (isAlreadyEnrolled) {
                    // Nếu đã đăng ký rồi, vẫn tìm course và navigate
                    setIsModalOpen(false);
                    setNotification({
                        isOpen: true,
                        type: "info",
                        message: "Bạn đã tham gia khóa học này rồi!"
                    });

                    const found = await findAndNavigateToCourse();
                    if (!found) {
                        setNotification({
                            isOpen: true,
                            type: "error",
                            message: "Không tìm thấy khóa học. Vui lòng thử lại."
                        });
                    }
                } else {
                    // Các lỗi khác
                    setNotification({
                        isOpen: true,
                        type: "error",
                        message: errorMessage || "Không thể tham gia lớp học. Vui lòng kiểm tra lại mã lớp."
                    });
                }
            }
        } catch (error) {
            console.error("Error joining class:", error);
            const errorMessage = error.response?.data?.message || "Không thể tham gia lớp học. Vui lòng kiểm tra lại mã lớp.";

            // Kiểm tra xem có phải "đã đăng ký rồi" không
            const isAlreadyEnrolled = errorMessage.includes("đã đăng ký") || errorMessage.includes("đã tham gia");

            if (isAlreadyEnrolled) {
                setIsModalOpen(false);
                setNotification({
                    isOpen: true,
                    type: "info",
                    message: "Bạn đã tham gia khóa học này rồi!"
                });

                // Vẫn tìm course và navigate
                try {
                    const systemCoursesResponse = await courseService.getSystemCourses();
                    if (systemCoursesResponse.data?.success && systemCoursesResponse.data?.data) {
                        const allSystemCourses = systemCoursesResponse.data.data;
                        const foundCourse = allSystemCourses.find(c => c.classCode === classCode);
                        if (foundCourse) {
                            navigate(`/course/${foundCourse.courseId}`);
                        }
                    }
                } catch (err) {
                    console.error("Error finding course:", err);
                }
            } else {
                setNotification({
                    isOpen: true,
                    type: "error",
                    message: errorMessage
                });
            }
        }
    };

    const handleContinueCourse = (course) => {
        const courseId = course.id || course.courseId;
        if (courseId) {
            navigate(`/course/${courseId}`);
        }
    };

    const handleStartCourse = (course) => {
        const courseId = course.id || course.courseId;
        if (courseId) {
            navigate(`/course/${courseId}`);
        }
    };

    return (
        <>
            <MainHeader />
            <div className="my-courses-container">
                <div className="my-courses-header">
                    <h1>Khoá học của tôi</h1>
                    <div className="header-actions">
                        <div className="search-box">
                            <FaSearch className="search-icon" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm khoá học..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button
                            className="join-class-btn"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <FaPlus />
                            Nhập mã lớp học
                        </button>
                    </div>
                </div>

                {/* Registered Courses */}
                <section className="courses-section">
                    <h2>Khoá học đã đăng ký</h2>
                    {loading ? (
                        <div className="loading-message">Đang tải khóa học...</div>
                    ) : error ? (
                        <div className="error-message">{error}</div>
                    ) : (searchQuery ? filteredRegisteredCourses : registeredCourses).length > 0 ? (
                        <div className="course-grid-wrapper">
                            <div className="course-grid">
                                {(searchQuery ? filteredRegisteredCourses : registeredCourses).map((course) => (
                                    <RegisteredCourseCard
                                        key={course.id}
                                        course={course}
                                        onContinue={handleContinueCourse}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="no-courses-message">
                            {searchQuery ? "Không tìm thấy khóa học đã đăng ký" : "Chưa có khóa học đã đăng ký"}
                        </div>
                    )}
                </section>

                {/* Public Courses */}
                <section className="courses-section">
                    <h2>Khoá học công khai</h2>
                    {loading ? (
                        <div className="loading-message">Đang tải khóa học...</div>
                    ) : error ? (
                        <div className="error-message">{error}</div>
                    ) : (searchQuery ? filteredPublicCourses : publicCourses).length > 0 ? (
                        <div className="course-grid-wrapper">
                            <div className="course-grid">
                                {(searchQuery ? filteredPublicCourses : publicCourses).map((course) => (
                                    <PublicCourseCard
                                        key={course.id}
                                        course={course}
                                        onStart={handleStartCourse}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="no-courses-message">
                            {searchQuery ? "Không tìm thấy khóa học công khai" : "Chưa có khóa học công khai"}
                        </div>
                    )}
                </section>
            </div>

            <JoinClassModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onJoin={handleJoinClass}
            />

            <NotificationModal
                isOpen={notification.isOpen}
                onClose={() => setNotification({ ...notification, isOpen: false })}
                type={notification.type}
                message={notification.message}
                autoClose={true}
                autoCloseDelay={3000}
            />
        </>
    );
}

