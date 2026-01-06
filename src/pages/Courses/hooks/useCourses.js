
import { useState } from 'react';
import { INITIAL_FORM_DATA } from '../constants/courseConstants';
import { validateCourseForm } from '../utils/validators';
import { MOCK_COURSES } from '../../../data/mockCourses';

export const useCourses = () => {
    const [courses, setCourses] = useState(MOCK_COURSES);
    const [showModal, setShowModal] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        let val = value;
        if (type === 'checkbox') {
            val = (name === 'accessPlatforms') ? value : checked;
        } else if (value === 'true') {
            val = true;
        } else if (value === 'false') {
            val = false;
        }

        if (name === 'accessPlatforms') {
            // Handle multi-select checkbox for accessPlatforms
            setFormData(prev => {
                const current = prev.accessPlatforms || [];
                if (checked) {
                    return { ...prev, accessPlatforms: [...current, value] };
                } else {
                    return { ...prev, accessPlatforms: current.filter(item => item !== value) };
                }
            });
        } else {
            setFormData(prev => ({ ...prev, [name]: val }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                img: file,
                imgPreview: URL.createObjectURL(file)
            }));
        }
    };

    const resetForm = () => {
        setFormData(INITIAL_FORM_DATA);
        setEditIndex(null);
        setStep(1);
    };

    const openModal = (index = null) => {
        if (index !== null) {
            const c = courses[index];
            setFormData({
                name: c.name,
                desc: c.desc,
                overview: c.overview || "",
                toolsCovered: c.toolsCovered || "",

                img: null,
                imgPreview: c.img,

                showValidity: c.showValidity || false,
                validityDuration: c.validityDuration || "",
                accessPlatforms: c.accessPlatforms || ['Website'],
                allowOffline: c.allowOffline || false,
                showLearnInfo: c.showLearnInfo || false,
                showAvatar: c.showAvatar || false,
                allowBookmark: c.allowBookmark || false,
                provideCertificate: c.provideCertificate || false,
                certificateTemplate: c.certificateTemplate || ""
            });
            setEditIndex(index);
        } else {
            resetForm();
        }
        setShowModal(true);
    };

    const handleSave = () => {
        // Validation check
        const errors = validateCourseForm(formData);
        if (errors.length > 0) {
            alert(errors.join("\n"));
            return;
        }

        const imgURL = formData.img ? URL.createObjectURL(formData.img) : formData.imgPreview;

        const newCourse = {
            ...formData,
            img: imgURL
        };

        if (editIndex !== null) {
            setCourses(courses.map((c, i) => (i === editIndex ? newCourse : c)));
        } else {
            setCourses([...courses, newCourse]);
        }

        setShowModal(false);
        resetForm();
    };

    const handleDelete = (index) => {
        if (window.confirm("Delete this course?")) {
            setCourses(courses.filter((_, i) => i !== index));
        }
    };

    return {
        courses,
        showModal,
        setShowModal,
        openModal,
        handleDelete,
        handleSave,
        handleInputChange,
        handleImageChange,
        formData,
        step,
        setStep,
        step,
        setStep,
        editIndex,
        setFormData
    };
};
