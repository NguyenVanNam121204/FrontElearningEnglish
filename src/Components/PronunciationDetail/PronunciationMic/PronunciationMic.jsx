import React from "react";
import { Button } from "react-bootstrap";
import { FaMicrophone, FaStop } from "react-icons/fa";
import "./PronunciationMic.css";

export default function PronunciationMic({
    isRecording,
    isProcessing,
    onStartRecording,
    onStopRecording
}) {
    return (
        <div className="pronunciation-mic-container">
            <Button
                variant="primary"
                className={`mic-button ${isRecording ? "recording" : ""} ${isProcessing ? "processing" : ""}`}
                onClick={isRecording ? onStopRecording : onStartRecording}
                disabled={isProcessing}
                style={{
                    backgroundColor: isRecording ? '#ef4444' : '#41d6e3',
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none',
                    boxShadow: isRecording
                        ? '0 4px 12px rgba(239, 68, 68, 0.3)'
                        : '0 4px 12px rgba(65, 214, 227, 0.3)'
                }}
            >
                {isProcessing ? (
                    <div className="spinner-border spinner-border-sm text-white" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                ) : isRecording ? (
                    <FaStop size={24} color="white" />
                ) : (
                    <FaMicrophone size={24} color="white" />
                )}
            </Button>
        </div>
    );
}

