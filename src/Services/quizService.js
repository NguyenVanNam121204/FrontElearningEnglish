import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "./apiConfig";

export const quizService = {
    getByLesson: (lessonId) => axiosClient.get(API_ENDPOINTS.QUIZZES.GET_BY_LESSON(lessonId)),
    
    getById: (quizId) => axiosClient.get(API_ENDPOINTS.QUIZZES.GET_BY_ID(quizId)),
    
    getByAssessment: (assessmentId) => axiosClient.get(API_ENDPOINTS.QUIZZES.GET_BY_ASSESSMENT(assessmentId)),
};

