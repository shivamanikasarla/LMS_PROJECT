import { FiPlus, FiTrash2, FiUser, FiMessageSquare } from 'react-icons/fi';
import './SectionStyles.css';

const Testimonials = ({ testimonials, setTestimonials }) => {

    const addTestimonial = () => {
        setTestimonials([...testimonials, { id: Date.now(), name: '', text: '', image: null }]);
    };

    const updateTestimonial = (id, field, value) => {
        setTestimonials(testimonials.map(t => t.id === id ? { ...t, [field]: value } : t));
    };

    const removeTestimonial = (id) => {
        setTestimonials(testimonials.filter(t => t.id !== id));
    };

    const handleImageUpload = (id, e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            updateTestimonial(id, 'image', url);
        }
    };

    return (
        <div className="section-container">
            <div className="section-header">
                <div className="section-title">Testimonials</div>
                <button type="button" className="btn-add-new" onClick={addTestimonial}>
                    <FiPlus /> Add new
                </button>
            </div>

            {testimonials.length > 0 ? (
                <>
                    <div className="table-header grid-testimonials">
                        <div className="header-cell">PICTURE</div>
                        <div className="header-cell">NAME</div>
                        <div className="header-cell">TESTIMONIAL</div>
                        <div className="header-cell"></div>
                    </div>
                    <div>
                        {testimonials.map(item => (
                            <div key={item.id} className="list-item grid-testimonials">
                                <label className="item-upload">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={(e) => handleImageUpload(item.id, e)}
                                    />
                                    {item.image ? (
                                        <img src={item.image} alt={item.name} />
                                    ) : (
                                        <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" alt="Default User" style={{ opacity: 0.6 }} />
                                    )}
                                </label>
                                <input
                                    type="text"
                                    className="item-input"
                                    placeholder="Enter name"
                                    value={item.name}
                                    onChange={(e) => updateTestimonial(item.id, 'name', e.target.value)}
                                />
                                <textarea
                                    className="item-input"
                                    placeholder="Enter testimonial"
                                    rows={2}
                                    style={{ minHeight: '60px', resize: 'vertical' }}
                                    value={item.text}
                                    onChange={(e) => updateTestimonial(item.id, 'text', e.target.value)}
                                />
                                <button type="button" className="btn-remove" onClick={() => removeTestimonial(item.id)}>
                                    <FiTrash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="empty-state" onClick={addTestimonial}>
                    <FiPlus className="add-icon-large" />
                    <span>List testimonials for your webinar page</span>
                </div>
            )}
        </div>
    );
};

export default Testimonials;
