import React, { useState, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { TOPIC_BOARDS } from '../constants';

const CreateThreadModal = ({ isOpen, onClose, onSubmit, boardId }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedBoard, setSelectedBoard] = useState(boardId || 'doubts');
    const [courseName, setCourseName] = useState(''); // Optional course linking
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setTitle('');
            setContent('');
            setCourseName('');
            setSelectedBoard(boardId || 'doubts');
        }
    }, [isOpen, boardId]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;

        setIsSubmitting(true);
        await onSubmit({
            title,
            content,
            boardId: selectedBoard,
            courseName: courseName.trim() || null
        });
        setIsSubmitting(false);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Start a New Discussion</h2>
                    <button className="close-btn" onClick={onClose}><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Topic Board</label>
                        <div className="select-wrapper">
                            <select
                                className="form-control"
                                value={selectedBoard}
                                onChange={(e) => setSelectedBoard(e.target.value)}
                                disabled={!!boardId} // Lock if opened from a specific board
                            >
                                {TOPIC_BOARDS.map(board => (
                                    <option
                                        key={board.id}
                                        value={board.id}
                                        disabled={board.accessLevel === 'read-only'} // naive check
                                    >
                                        {board.icon} {board.name}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={16} className="select-icon" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Title</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="e.g., How do I use React Context?"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                            className="form-control form-textarea"
                            placeholder="Describe your question or topic in detail..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={6}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            Related Course {boardId === 'doubts' && <span style={{ color: '#ef4444' }}>*</span>}
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder={boardId === 'doubts' ? "e.g., React Course, Python Fundamentals" : "e.g., React Mastery or Batch 45"}
                            value={courseName}
                            onChange={(e) => setCourseName(e.target.value)}
                            required={boardId === 'doubts'}
                        />
                        <p className="form-hint">
                            {boardId === 'doubts'
                                ? 'Required - helps organize questions by course'
                                : 'Optional - helps peers find your question'}
                        </p>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Posting...' : 'Create Discussion'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateThreadModal;
