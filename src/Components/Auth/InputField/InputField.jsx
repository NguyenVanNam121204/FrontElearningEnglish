import React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./InputField.css";

export default function InputField({
    type = "text",
    placeholder,
    value,
    onChange,
    error,
    disabled = false,
    showPasswordToggle = false,
    onTogglePassword,
    showPassword = false,
    name,
}) {
    return (
        <div className="input-field-wrapper">
            <div className={`input-field-container ${error ? "error" : ""}`}>
                <input
                    type={showPasswordToggle && !showPassword ? "password" : type}
                    className="input-field"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    name={name}
                />
                {showPasswordToggle && (
                    <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={onTogglePassword}
                        tabIndex={-1}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                )}
            </div>
            {error && <span className="input-field-error">{error}</span>}
        </div>
    );
}

