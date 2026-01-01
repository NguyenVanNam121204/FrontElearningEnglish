import axiosClient from "./axiosClient";

/**
 * Service để lấy enum từ backend
 */
const enumService = {
    /**
     * Lấy tất cả enums từ backend
     * @returns {Promise} Response chứa object với key là tên enum, value là array các enum values
     */
    getAllEnums: () => axiosClient.get("/api/public/enums"),
};

export default enumService;
