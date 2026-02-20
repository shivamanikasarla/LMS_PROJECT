
import React from 'react';
import { FiX, FiVideo, FiFile, FiMusic, FiDatabase, FiType, FiFileText, FiCode, FiLayout } from 'react-icons/fi';

const UPLOAD_ITEMS = [
    { id: 'pdf', label: 'PDF', desc: 'Add a PDF file in the course.', icon: FiFileText },
    { id: 'video', label: 'Video', desc: 'All uploaded videos are completely secure and non downloadable.', icon: FiVideo },
];

const CREATE_ITEMS = [
    { id: 'heading', label: 'Heading', desc: 'Define your chapter or section headings.', icon: FiType },
];

const ContentTypeSelector = ({ onSelect, onClose }) => {
    return (
        <div className="cts-overlay">
            <div className="cts-modal-content">
                <div className="cts-header" style={{ padding: '24px 32px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0 }}>Select Content Type</h3>
                    <button className="btn-icon" onClick={onClose}><FiX size={20} /></button>
                </div>

                <div className="cts-layout-split">
                    {/* Left Col: Upload */}
                    <div className="cts-col">
                        <div className="cts-col-title">Upload new item</div>
                        <div className="cts-list">
                            {UPLOAD_ITEMS.map(item => (
                                <div key={item.id} className="cts-item-row" onClick={() => onSelect(item.id)}>
                                    <div className="cts-radio"></div>
                                    <div className="cts-item-info">
                                        <span className="cts-item-title">{item.label}</span>
                                        <span className="cts-item-desc">{item.desc}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Col: Create */}
                    <div className="cts-col">
                        <div className="cts-col-title">Create new item</div>
                        <div className="cts-list">
                            {CREATE_ITEMS.map(item => (
                                <div key={item.id} className="cts-item-row" onClick={() => onSelect(item.id)}>
                                    <div className="cts-radio" style={{ borderColor: '#0f172a', background: '#0f172a', boxShadow: 'inset 0 0 0 3px #fff' }}></div>
                                    {/* Mocking selected state visual just for one to match screenshot style or just standard radio */}
                                    <div className="cts-item-info">
                                        <span className="cts-item-title">{item.label}</span>
                                        <span className="cts-item-desc">{item.desc}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContentTypeSelector;
