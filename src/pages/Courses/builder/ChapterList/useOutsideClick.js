import { useEffect } from "react";

export default function useOutsideClick(ref, handler) {
    useEffect(() => {
        const listener = (e) => {
            if (!ref.current || ref.current.contains(e.target)) return;
            handler();
        };

        document.addEventListener("mousedown", listener);
        return () => document.removeEventListener("mousedown", listener);
    }, [ref, handler]);
}
