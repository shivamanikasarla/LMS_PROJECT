import React, { useRef } from "react";
import { createPortal } from "react-dom";
import {
    FiPlusCircle,
    FiEdit2,
    FiTrash2,
    FiArrowUp,
    FiArrowDown
} from "react-icons/fi";
import useOutsideClick from "./useOutsideClick";

const MENU_WIDTH = 200;

const ContextMenu = ({
    position,
    onClose,
    type,
    onAdd,
    onEdit,
    onMoveUp,
    onMoveDown,
    onDelete
}) => {
    const ref = useRef(null);
    useOutsideClick(ref, onClose);

    return createPortal(
        <div
            ref={ref}
            className="chapter-menu-dropdown"
            style={{
                position: "fixed",
                top: position.top,
                left: position.left,
                width: MENU_WIDTH,
                background: "white",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                borderRadius: "0.5rem",
                padding: "0.5rem",
                zIndex: 9999,
                border: "1px solid #e5e7eb"
            }}
        >
            <button className="cmd-item w-100 text-start btn btn-sm btn-light mb-1 d-flex align-items-center gap-2" onClick={onAdd}>
                <FiPlusCircle /> Add item
            </button>

            {type === "chapter" && (
                <button className="cmd-item w-100 text-start btn btn-sm btn-light mb-1 d-flex align-items-center gap-2" onClick={onEdit}>
                    <FiEdit2 /> Rename
                </button>
            )}

            <button className="cmd-item w-100 text-start btn btn-sm btn-light mb-1 d-flex align-items-center gap-2" onClick={onMoveUp}>
                <FiArrowUp /> Move up
            </button>

            <button className="cmd-item w-100 text-start btn btn-sm btn-light mb-1 d-flex align-items-center gap-2" onClick={onMoveDown}>
                <FiArrowDown /> Move down
            </button>

            <button className="cmd-item w-100 text-start btn btn-sm btn-light text-danger d-flex align-items-center gap-2" onClick={onDelete}>
                <FiTrash2 /> Remove
            </button>
        </div>,
        document.body
    );
};

export default ContextMenu;
