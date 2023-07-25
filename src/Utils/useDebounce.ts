import { useEffect, useState } from "react";

export interface DebounceResult {
    debouncing: boolean,
    startDebounce: (callback: () => void) => void,
    cancelDebounce: () => void,
}

export default (durationMS: number): DebounceResult => {
    const [debounce, setDebounce] = useState<NodeJS.Timeout>(setTimeout(() => {
        // init timeout function that does nothing
    }, 0));
    const [debouncing, setDebouncing] = useState<boolean>(false);

    const cancelDebounce = () => clearTimeout(debounce);
    const startDebounce = (callback: () => void) => setDebounce(oldTimeout => {
        clearTimeout(oldTimeout);
        setDebouncing(true);
        return setTimeout(() => {
            callback();
            setDebouncing(false);
        }, durationMS);
    });

    useEffect(() => cancelDebounce, []);

    return {
        debouncing,
        startDebounce,
        cancelDebounce,
    };
}
