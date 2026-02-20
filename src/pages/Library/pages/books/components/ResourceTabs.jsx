import React from 'react';
import { Book as BookIcon, Monitor } from 'lucide-react';

const ResourceTabs = ({ viewMode, setViewMode, onViewChange }) => {
    const handleChange = (mode) => {
        if (mode !== viewMode) {
            setViewMode(mode);
            onViewChange?.(mode); // optional callback to reset filters
        }
    };

    return (
        <div className="card-header bg-transparent border-bottom-0 pb-0">
            <ul className="nav nav-tabs card-header-tabs" role="tablist">
                <li className="nav-item" role="presentation">
                    <button
                        type="button"
                        role="tab"
                        aria-selected={viewMode === 'PHYSICAL'}
                        className={`nav-link ${viewMode === 'PHYSICAL' ? 'active' : ''}`}
                        onClick={() => handleChange('PHYSICAL')}
                    >
                        <BookIcon size={18} className="me-2" />
                        Physical Books
                    </button>
                </li>

                <li className="nav-item" role="presentation">
                    <button
                        type="button"
                        role="tab"
                        aria-selected={viewMode === 'DIGITAL'}
                        className={`nav-link ${viewMode === 'DIGITAL' ? 'active' : ''}`}
                        onClick={() => handleChange('DIGITAL')}
                    >
                        <Monitor size={18} className="me-2" />
                        Digital Resources
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default ResourceTabs;
