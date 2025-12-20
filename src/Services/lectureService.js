import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "./apiConfig";

export const lectureService = {
    getLecturesByModuleId: (moduleId) => axiosClient.get(API_ENDPOINTS.LECTURES.GET_BY_MODULE(moduleId)),
    
    getLectureTreeByModuleId: (moduleId) => axiosClient.get(`${API_ENDPOINTS.LECTURES.GET_BY_MODULE(moduleId)}/tree`),
    
    getLectureById: (lectureId) => axiosClient.get(API_ENDPOINTS.LECTURES.GET_BY_ID(lectureId)),
};

