import {useEffect} from "react";

const MOUSE_DOWN_EVENT_KEY = "mousedown";

export function useClickOutside(ref, func) {
    useEffect(() => {
        function onClick(e) {
            if (ref.current && !ref.current.contains(e.target))
                func();
        }

        document.addEventListener(MOUSE_DOWN_EVENT_KEY, onClick);
        return () => document.removeEventListener(MOUSE_DOWN_EVENT_KEY, onClick);
    }, [ref, func]);
}