import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "./apiConfig";

export const essaySubmissionService = {
    submit: (data) => axiosClient.post(API_ENDPOINTS.ESSAY_SUBMISSIONS.SUBMIT, data),
    
    getByEssay: (essayId) => axiosClient.get(API_ENDPOINTS.ESSAY_SUBMISSIONS.GET_BY_ESSAY(essayId)),
    
    getById: (submissionId) => axiosClient.get(API_ENDPOINTS.ESSAY_SUBMISSIONS.GET_BY_ID(submissionId)),
    
    mySubmissions: () => axiosClient.get(API_ENDPOINTS.ESSAY_SUBMISSIONS.MY_SUBMISSIONS),
    
    getSubmissionStatus: (essayId) => axiosClient.get(`/user/essay-submissions/submission-status/essay/${essayId}`),
};

