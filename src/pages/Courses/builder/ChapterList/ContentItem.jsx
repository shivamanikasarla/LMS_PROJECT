import React from "react";
import { FiLock, FiFileText } from "react-icons/fi";

const ContentItem = ({
    item,
    active,
    locked,
    onClick,
    onMenu
}) => {
    return (
        <div
            className={`d-flex justify-content-between align-items-center py-1 px-2 cursor-pointer mt-1 rounded ${active ? "bg-primary bg-opacity-10 text-primary fw-medium" : "hover-bg-light text-secondary"} ${locked ? "opacity-50" : ""}`}
            style={{ transition: 'all 0.2s', marginLeft: '24px', cursor: locked ? 'not-allowed' : 'pointer' }}
            onClick={!locked ? onClick : undefined}
        >
            <div className="d-flex align-items-center gap-2">
                <span className={`tree-icon ${active ? "text-primary" : "text-muted"}`}>
                    {locked ? <FiLock size={12} /> : <FiFileText size={12} />}
                </span>
                <span className="text-truncate" style={{ maxWidth: "150px", fontSize: '14px' }}>{item.title}</span>
            </div>

            {!locked && onMenu && (
                <button
                    className={`btn btn-sm p-0 border-0 ${active ? "text-primary" : "text-muted"} opacity-50 hover-opacity-100`}
                    onClick={onMenu}
                    style={{ lineHeight: 1 }}
                >
                    ⋮
                </button>
            )}
        </div>
    );
};

export default ContentItem;
