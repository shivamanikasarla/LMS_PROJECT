
/**
 * Validate course form data
 * @param {Object} formData 
 * @returns {Array} errors
 */
export const validateCourseForm = (formData) => {
    const errors = [];
    if (!formData.name) errors.push("Course name is required");


    return errors;
};
