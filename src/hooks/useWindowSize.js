import {useEffect, useState} from "react";

const RESIZE_EVENT_KEY = "resize";

export function useWindowSize() {
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        function onResize() {
            setWidth(window.innerWidth);
            setHeight(window.innerHeight);
        }

        window.addEventListener(RESIZE_EVENT_KEY, onResize);
        onResize();

        return () => window.removeEventListener(RESIZE_EVENT_KEY, onResize);
    }, []);

    return [width, height];
}
