import { DependencyList, useRef, useEffect } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default (effect: () => void, deps?: DependencyList, cleanupCallback?: () => any): void => {
    const firstRenderer = useRef<boolean>(true);

    useEffect(() => {
        if(!firstRenderer.current)
        {
            effect();
        }
        firstRenderer.current = false;
        return cleanupCallback;
    }, deps);
}
