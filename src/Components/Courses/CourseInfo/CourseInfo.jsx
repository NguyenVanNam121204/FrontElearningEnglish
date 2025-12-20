import React from "react";
import "./CourseInfo.css";

export default function CourseInfo({ course }) {
    const formatDescription = (description) => {
        if (!description) return "";
        // Split by newlines and create paragraphs
        return description.split('\n').filter(line => line.trim() !== '');
    };

    const descriptionLines = formatDescription(course.description);

    return (
        <div className="course-info">
            <section className="course-info-section">
                <h2 className="course-info-title">Giới thiệu khoá học</h2>
                
                <div className="course-info-subsection">
                    <h3 className="course-info-subtitle">Mô tả khoá học</h3>
                    <div className="course-description">
                        {descriptionLines.length > 0 ? (
                            descriptionLines.map((line, index) => (
                                <p key={index}>{line}</p>
                            ))
                        ) : (
                            <p>{course.description || "Khóa học này chưa có mô tả chi tiết."}</p>
                        )}
                    </div>
                </div>

                <div className="course-info-subsection">
                    <h3 className="course-info-subtitle">Bạn sẽ học được gì?</h3>
                    <ul className="course-benefits-list">
                        <li>Nắm vững 12 thì tiếng Anh và các cấu trúc câu phức tạp</li>
                        <li>Phân biệt và áp dụng đúng các loại mệnh đề, câu điều kiện, và thể bị động</li>
                        <li>Cải thiện đáng kể kỹ năng viết học thuật và giao tiếp chuyên nghiệp</li>
                        <li>Tự tin chinh phục các kỳ thi chứng chỉ quốc tế như IELTS, TOEFL, TOEIC</li>
                    </ul>
                </div>

                <div className="course-info-subsection">
                    <h3 className="course-info-subtitle">Yêu cầu khoá học</h3>
                    <ul className="course-requirements-list">
                        <li>Người học có nền tảng tiếng Anh vững chắc</li>
                        <li>Muốn nắm vững các cấu trúc ngữ pháp phức tạp</li>
                        <li>Đã hoàn thành các khóa học ngữ pháp cơ bản</li>
                        <li>Có động lực và cam kết học tập đều đặn</li>
                    </ul>
                </div>
            </section>
        </div>
    );
}

