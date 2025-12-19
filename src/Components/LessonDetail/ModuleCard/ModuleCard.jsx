import React from "react";
import { FaCheckCircle, FaPlay, FaMicrophone } from "react-icons/fa";
import { 
    FaBookOpen, 
    FaFileAlt, 
    FaEdit,
    FaGraduationCap
} from "react-icons/fa";
import "./ModuleCard.css";

export default function ModuleCard({ module, onClick }) {
    const {
        moduleId,
        name = "Module",
        contentType = 1, // 1=Lecture, 2=Quiz, 3=Assignment, 4=FlashCard
        contentTypeName = "Lecture",
        isCompleted = false,
        description = "",
        startedAt = null,
    } = module || {};

    const finalName = name || "Module";
    const finalContentType = contentType;
    const finalContentTypeName = contentTypeName || "Lecture";
    const finalIsCompleted = isCompleted;
    const finalDescription = description || "";

    // Determine module status
    const isInProgress = !finalIsCompleted && startedAt !== null;
    const isNotStarted = !finalIsCompleted && startedAt === null;

    // Get icon and class name based on content type (1=Lecture, 2=Quiz, 3=Assignment, 4=FlashCard)
    const getIconConfig = (type, typeName) => {
        const typeLower = (typeName || "").toLowerCase();
        if (type === 1 || typeLower.includes("lecture")) {
            return { icon: <FaBookOpen />, className: "lecture" };
        } else if (type === 4 || typeLower.includes("flashcard") || typeLower.includes("flash")) {
            return { icon: <FaFileAlt />, className: "flashcard" };
        } else if (type === 3 || typeLower.includes("assignment") || typeLower.includes("essay")) {
            return { icon: <FaEdit />, className: "assignment" };
        } else if (type === 2 || typeLower.includes("quiz") || typeLower.includes("test")) {
            return { icon: <FaGraduationCap />, className: "quiz" };
        }
        return { icon: <FaBookOpen />, className: "lecture" };
    };
    
    const iconConfig = getIconConfig(finalContentType, finalContentTypeName);

    // Get button text and action
    const getButtonConfig = () => {
        if (finalIsCompleted) {
            return {
                text: "Đã học",
                icon: <FaCheckCircle />,
                className: "completed-btn",
            };
        } else if (isInProgress) {
            return {
                text: "Tiếp tục",
                icon: <FaPlay />,
                className: "continue-btn",
            };
        } else {
            return {
                text: "Bắt đầu",
                icon: <FaPlay />,
                className: "start-btn",
            };
        }
    };

    const buttonConfig = getButtonConfig();

    return (
        <div className={`module-card ${finalIsCompleted ? "completed" : ""}`}>
            <div className="module-icon-wrapper">
                <div className={`module-icon ${iconConfig.className}`}>
                    {iconConfig.icon}
                </div>
            </div>
            <div className="module-content">
                <h3 className="module-title">{finalName}</h3>
                {finalDescription && (
                    <p className="module-description">{finalDescription}</p>
                )}
            </div>
            <div className="module-actions">
                {(finalContentType === 4 || finalContentTypeName.toLowerCase().includes("flashcard")) && finalIsCompleted && (
                    <button className="pronunciation-btn">
                        <FaMicrophone />
                        <span>pronunciation</span>
                    </button>
                )}
                <button
                    className={`module-action-btn ${buttonConfig.className}`}
                    onClick={onClick}
                >
                    {buttonConfig.icon}
                    <span>{buttonConfig.text}</span>
                </button>
            </div>
        </div>
    );
}

