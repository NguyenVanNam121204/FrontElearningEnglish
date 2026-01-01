import { useEnums } from '../Context/EnumContext';

/**
 * Custom hook for Module Type utilities
 * Provides dynamic MODULE_TYPES object and helper functions
 */
export const useModuleTypes = () => {
    const { moduleTypes } = useEnums();

    // Tạo object MODULE_TYPES động từ enum
    const MODULE_TYPES = moduleTypes.reduce((acc, type) => {
        acc[type.name.toUpperCase()] = type.value;
        return acc;
    }, {});

    /**
     * Get module type label from value
     * @param {number} value - Module type value
     * @returns {string} Module type label
     */
    const getModuleTypeLabel = (value) => {
        const moduleType = moduleTypes.find(mt => mt.value === value);
        return moduleType ? moduleType.name : 'Unknown';
    };

    /**
     * Get module type name in lowercase (for URLs/paths)
     * @param {number} value - Module type value
     * @returns {string} Module type name in lowercase plural form
     */
    const getModuleTypePath = (value) => {
        const labels = {
            [MODULE_TYPES.LECTURE]: 'lectures',
            [MODULE_TYPES.FLASHCARD]: 'flashcards',
            [MODULE_TYPES.ASSESSMENT]: 'assessments'
        };
        return labels[value] || 'content';
    };

    /**
     * Check if module type is lecture
     * @param {number} value - Module type value
     * @returns {boolean}
     */
    const isLecture = (value) => {
        return value === MODULE_TYPES.LECTURE;
    };

    /**
     * Check if module type is flashcard
     * @param {number} value - Module type value
     * @returns {boolean}
     */
    const isFlashCard = (value) => {
        return value === MODULE_TYPES.FLASHCARD;
    };

    /**
     * Check if module type is assessment
     * @param {number} value - Module type value
     * @returns {boolean}
     */
    const isAssessment = (value) => {
        return value === MODULE_TYPES.ASSESSMENT;
    };

    /**
     * Check if module type is clickable (has detail page)
     * @param {number} value - Module type value
     * @returns {boolean}
     */
    const isClickable = (value) => {
        return value === MODULE_TYPES.LECTURE || 
               value === MODULE_TYPES.FLASHCARD || 
               value === MODULE_TYPES.ASSESSMENT;
    };

    return {
        MODULE_TYPES,
        moduleTypes,
        getModuleTypeLabel,
        getModuleTypePath,
        isLecture,
        isFlashCard,
        isAssessment,
        isClickable
    };
};
