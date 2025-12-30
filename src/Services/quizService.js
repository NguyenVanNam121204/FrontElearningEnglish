import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "./apiConfig";

export const quizService = {
    // User endpoints
    getByLesson: (lessonId) => axiosClient.get(API_ENDPOINTS.QUIZZES.GET_BY_LESSON(lessonId)),
    
    getById: (quizId) => axiosClient.get(API_ENDPOINTS.QUIZZES.GET_BY_ID(quizId)),
    
    getByAssessment: (assessmentId) => axiosClient.get(API_ENDPOINTS.QUIZZES.GET_BY_ASSESSMENT(assessmentId)),
    
    // Teacher endpoints
    createQuiz: (data) => axiosClient.post(API_ENDPOINTS.TEACHER.CREATE_QUIZ, data),
    
    getTeacherQuizById: (quizId) => axiosClient.get(API_ENDPOINTS.TEACHER.GET_QUIZ_BY_ID(quizId)),
    
    getTeacherQuizzesByAssessment: (assessmentId) => axiosClient.get(API_ENDPOINTS.TEACHER.GET_QUIZZES_BY_ASSESSMENT(assessmentId)),
    
    updateQuiz: (quizId, data) => axiosClient.put(API_ENDPOINTS.TEACHER.UPDATE_QUIZ(quizId), data),
    
    deleteQuiz: (quizId) => axiosClient.delete(API_ENDPOINTS.TEACHER.DELETE_QUIZ(quizId)),
};

