import { FiPlus, FiTrash2, FiCheckCircle } from 'react-icons/fi';
import './SectionStyles.css';

const LearningOutcomes = ({ outcomes, setOutcomes }) => {

    const addOutcome = () => {
        setOutcomes([...outcomes, { id: Date.now(), title: '', description: '', icon: 'check' }]);
    };

    const updateOutcome = (id, field, value) => {
        setOutcomes(outcomes.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const removeOutcome = (id) => {
        setOutcomes(outcomes.filter(item => item.id !== id));
    };

    return (
        <div className="section-container">
            <div className="section-header">
                <div className="section-title">Learning outcomes</div>
                <button type="button" className="btn-add-new" onClick={addOutcome}>
                    <FiPlus /> Add new
                </button>
            </div>

            {outcomes.length > 0 ? (
                <>
                    <div className="table-header grid-outcomes">
                        <div className="header-cell">ICON</div>
                        <div className="header-cell">TITLE</div>
                        <div className="header-cell">DESCRIPTION</div>
                        <div className="header-cell"></div>
                    </div>
                    <div>
                        {outcomes.map(item => (
                            <div key={item.id} className="list-item grid-outcomes">
                                <div className="item-upload" title="Icon">
                                    <FiCheckCircle size={24} color="#3b82f6" />
                                </div>
                                <input
                                    type="text"
                                    className="item-input"
                                    placeholder="Enter title"
                                    value={item.title}
                                    onChange={(e) => updateOutcome(item.id, 'title', e.target.value)}
                                />
                                <input
                                    type="text"
                                    className="item-input"
                                    placeholder="Enter description"
                                    value={item.description}
                                    onChange={(e) => updateOutcome(item.id, 'description', e.target.value)}
                                />
                                <button type="button" className="btn-remove" onClick={() => removeOutcome(item.id)}>
                                    <FiTrash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="empty-state" onClick={addOutcome}>
                    <FiPlus className="add-icon-large" />
                    <span>Add learning outcomes for your webinar page</span>
                </div>
            )}
        </div>
    );
};

export default LearningOutcomes;
