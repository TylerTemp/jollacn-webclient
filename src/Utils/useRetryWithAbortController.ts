import { useEffect, useRef, useState } from 'react';

export default () => {
    const [abortController, setAbortController] = useState<AbortController>(new AbortController());
    const [retryKey, setRetryKey] = useState <number>(Math.floor(Math.random() * 1000));
    const hasUnmounted = useRef<boolean>(false);
    useEffect(() => {

        return () => {
            if(hasUnmounted.current) {
                console.log(`cleanUp abortController`, abortController);
                abortController.abort();
            }
            hasUnmounted.current = true;
        };
    }, []);

    return {
        retryKey,
        doRetry: () => setRetryKey((old) => -old),
        // abortController,
        doAbort: () => {
            const newAbortController = new AbortController();
            setAbortController((old) => {
                old.abort();
                return newAbortController;
            });
            return newAbortController.signal;
        },
    };
};
