import React, { useState, useEffect, useRef } from "react";
import { FaVolumeUp, FaChevronLeft, FaChevronRight, FaCheckCircle } from "react-icons/fa";
import "./FlashCardViewer.css";

export default function FlashCardViewer({ flashcard, onPrevious, onNext, canGoPrevious, canGoNext, isLastCard = false, onComplete }) {
    const [isFlipped, setIsFlipped] = useState(false);
    const audioRef = useRef(null);

    // Reset flipped state when flashcard changes
    useEffect(() => {
        setIsFlipped(false);
        // Clean up audio when flashcard changes
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
    }, [flashcard?.flashCardId]);

    if (!flashcard) {
        return <div className="flashcard-viewer-empty">Không có flashcard</div>;
    }

    const word = flashcard.word || "";
    const meaning = flashcard.meaning || "";
    const pronunciation = flashcard.pronunciation || "";
    const imageUrl = flashcard.imageUrl || "";
    const audioUrl = flashcard.audioUrl || "";

    const handleCardClick = () => {
        setIsFlipped(!isFlipped);
    };

    const handleAudioClick = async (e) => {
        e.stopPropagation();
        if (!audioUrl) {
            console.warn("No audio URL provided");
            return;
        }

        try {
            // Stop any currently playing audio
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = "";
                audioRef.current = null;
            }
            
            // Try fetching audio as blob first (to bypass CORS if possible)
            try {
                const response = await fetch(audioUrl, {
                    method: 'GET',
                    headers: {
                        'Accept': 'audio/mpeg, audio/*',
                    },
                    mode: 'cors', // Try CORS first
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const blob = await response.blob();
                const blobUrl = URL.createObjectURL(blob);
                const audio = new Audio(blobUrl);
                
                audio.onended = () => {
                    // Clean up blob URL when audio ends
                    URL.revokeObjectURL(blobUrl);
                };
                
                audioRef.current = audio;
                await audio.play();
                console.log("Audio playing successfully via blob");
            } catch (fetchError) {
                // If fetch fails, try direct audio URL
                console.log("Fetch failed, trying direct audio URL:", fetchError);
                const audio = new Audio(audioUrl);
                audioRef.current = audio;
                await audio.play();
                console.log("Audio playing successfully via direct URL");
            }
        } catch (err) {
            console.error("Error playing audio:", err);
            console.error("Error name:", err.name);
            console.error("Error message:", err.message);
            console.error("Audio URL:", audioUrl);
            
            // Silent fail - don't show alert as it might be annoying
            // User can check console for details
        }
    };

    const handleNavClick = (e, direction) => {
        e.stopPropagation();
        if (direction === "prev" && canGoPrevious && onPrevious) {
            onPrevious();
        } else if (direction === "next" && canGoNext && onNext) {
            onNext();
        }
    };

    return (
        <>
            <div className="flashcard-viewer-wrapper">
                <button
                    className={`flashcard-nav-button prev-button ${!canGoPrevious ? "disabled" : ""}`}
                    onClick={(e) => handleNavClick(e, "prev")}
                    disabled={!canGoPrevious}
                >
                    <FaChevronLeft />
                </button>
                <div 
                    className={`flashcard-viewer ${isFlipped ? "flipped" : ""}`}
                    onClick={handleCardClick}
                >
                    <div className="flashcard-inner">
                        <div className="flashcard-front">
                            {imageUrl && (
                                <div className="flashcard-image">
                                    <img src={imageUrl} alt={word} />
                                </div>
                            )}
                            <div className="flashcard-content">
                                <div className="flashcard-word-row">
                                    <h2 className="flashcard-word">{word}</h2>
                                    {audioUrl && (
                                        <button 
                                            className="flashcard-audio-btn"
                                            onClick={handleAudioClick}
                                        >
                                            <FaVolumeUp />
                                        </button>
                                    )}
                                </div>
                                {pronunciation && (
                                    <p className="flashcard-pronunciation">{pronunciation}</p>
                                )}
                                <p className="flashcard-hint">Ấn vào thẻ để lật</p>
                            </div>
                        </div>
                        <div className="flashcard-back">
                            {imageUrl && (
                                <div className="flashcard-image">
                                    <img src={imageUrl} alt={word} />
                                </div>
                            )}
                            <div className="flashcard-content">
                                <h2 className="flashcard-word">{word}</h2>
                                {pronunciation && (
                                    <p className="flashcard-pronunciation">{pronunciation}</p>
                                )}
                                <div className="flashcard-meaning">
                                    <p>{meaning}</p>
                                </div>
                                <p className="flashcard-hint">Ấn vào thẻ để lật</p>
                            </div>
                        </div>
                    </div>
                </div>
                <button
                    className={`flashcard-nav-button next-button ${!canGoNext ? "disabled" : ""}`}
                    onClick={(e) => handleNavClick(e, "next")}
                    disabled={!canGoNext}
                >
                    <FaChevronRight />
                </button>
            </div>
            {isLastCard && (
                <button
                    className="flashcard-complete-button"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (onComplete) {
                            onComplete();
                        }
                    }}
                >
                    <FaCheckCircle />
                    <span>Hoàn thành flash card</span>
                </button>
            )}
        </>
    );
}

