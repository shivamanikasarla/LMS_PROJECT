import React from "react";
import { FiChevronRight, FiMoreVertical } from "react-icons/fi";
import ContentItem from "./ContentItem";

const ChapterItem = ({
    chapter,
    expanded,
    active,
    activeContentId,
    onToggle,
    onSelect,
    onMenu,
    onSelectContent,
    isFreeMode
}) => {
    return (
        <div className="mb-2">
            <div
                className={`d-flex justify-content-between align-items-center p-2 rounded cursor-pointer ${active ? "bg-primary text-white" : "hover-bg-light"}`}
                style={{ transition: 'background 0.2s', borderLeft: active ? '4px solid #0d6efd' : '4px solid transparent' }}
                onClick={onSelect}
            >
                <div className="d-flex align-items-center gap-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); onToggle(); }}
                        className={`btn btn-sm p-0 border-0 d-flex align-items-center ${active ? "text-white" : "text-dark"}`}
                        style={{ transition: 'transform 0.2s', transform: expanded ? 'rotate(90deg)' : 'rotate(0)' }}
                    >
                        <FiChevronRight size={18} />
                    </button>
                    <span className="fw-semibold" style={{ fontSize: '15px' }}>{chapter.title}</span>
                </div>

                {!isFreeMode && (
                    <button
                        className={`btn btn-sm p-0 border-0 ${active ? "text-white opacity-75" : "text-muted"}`}
                        onClick={(e) => onMenu(e, chapter.id, "chapter")}
                    >
                        <FiMoreVertical size={16} />
                    </button>
                )}
            </div>

            {expanded && (
                <div className="pt-1 ps-2">
                    {chapter.contents?.map(item => (
                        <ContentItem
                            key={item.id}
                            item={item}
                            active={item.id === activeContentId}
                            locked={isFreeMode && !item.data?.isPreview}
                            onClick={() => onSelectContent(chapter.id, item)}
                            onMenu={(e) => onMenu(e, item.id, "content")}
                        />
                    ))}
                    {(!chapter.contents || chapter.contents.length === 0) && (
                        <div className="text-muted small ps-4 py-2 opacity-75">No contents yet</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ChapterItem;
