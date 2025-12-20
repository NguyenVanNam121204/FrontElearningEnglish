import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "./apiConfig";

export const flashcardService = {
    getFlashcardsByModuleId: (moduleId) => axiosClient.get(API_ENDPOINTS.FLASHCARDS.GET_BY_MODULE(moduleId)),
    getFlashcardById: (flashcardId) => axiosClient.get(API_ENDPOINTS.FLASHCARDS.GET_BY_ID(flashcardId)),
};

