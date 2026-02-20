import React, { useState } from "react";
import ChapterItem from "./ChapterItem";
import ContextMenu from "./ContextMenu";

const ChapterList = ({
    chapters,
    onAddItem,
    onDelete,
    onMoveUp,
    onMoveDown,
    onEdit,
    activeChapterId,
    activeContentId,
    onSelectChapter,
    onSelectContent,
    readOnly = false
}) => {
    const [expanded, setExpanded] = useState({});
    const [menu, setMenu] = useState(null);

    const openMenu = (e, id, type) => {
        e.stopPropagation();
        e.preventDefault(); // Prevent default browser context menu
        const rect = e.currentTarget.getBoundingClientRect();

        // Calculate safe position (keep menu within viewport)
        const top = rect.bottom;
        const left = rect.right - 200 > 0 ? rect.right - 200 : rect.left;

        setMenu({
            id,
            type,
            position: {
                top: top + window.scrollY + 4,
                left: left + window.scrollX
            }
        });
    };

    const handleAction = (action) => {
        if (menu) {
            action(menu.id, menu.type);
            setMenu(null);
        }
    };

    return (
        <div className="chapter-list-sidebar h-100 overflow-auto p-2">
            {chapters.map(ch => (
                <ChapterItem
                    key={ch.id}
                    chapter={ch}
                    active={ch.id === activeChapterId}
                    activeContentId={activeContentId}
                    expanded={expanded[ch.id]}
                    isFreeMode={readOnly}
                    onToggle={() =>
                        setExpanded(p => ({ ...p, [ch.id]: !p[ch.id] }))
                    }
                    onSelect={() => onSelectChapter(ch)}
                    onSelectContent={onSelectContent}
                    onMenu={(e, id, type) => openMenu(e, id, type)}
                />
            ))}

            {menu && (
                <ContextMenu
                    type={menu.type}
                    position={menu.position}
                    onClose={() => setMenu(null)}
                    onAdd={() => handleAction(onAddItem)}
                    onEdit={() => handleAction(onEdit)}
                    onDelete={() => handleAction(onDelete)}
                    onMoveUp={() => handleAction(onMoveUp)}
                    onMoveDown={() => handleAction(onMoveDown)}
                />
            )}
        </div>
    );
};

export default ChapterList;
