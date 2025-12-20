import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "./apiConfig";

export const assessmentService = {
    getByLesson: (lessonId) => axiosClient.get(API_ENDPOINTS.ASSESSMENTS.GET_BY_LESSON(lessonId)),
    
    getByModule: (moduleId) => axiosClient.get(API_ENDPOINTS.ASSESSMENTS.GET_BY_MODULE(moduleId)),
    
    getById: (assessmentId) => axiosClient.get(API_ENDPOINTS.ASSESSMENTS.GET_BY_ID(assessmentId)),
};

