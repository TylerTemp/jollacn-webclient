import { useEffect, useState } from "react";

export default() => {
    const [abortController, setAbortController] = useState<AbortController>(null);
    const [retryKey, setRetryKey] = useState<number>(Math.floor(Math.random() * 1000));
    useEffect(() => {
        setAbortController(new AbortController());
        return () => abortController.abort();
    }, []);

    return {
        retryKey,
        doRetry: () => setRetryKey(old => -old),
        // abortController,
        doAbort: () => {
            const newAbortController = new AbortController();
            setAbortController(old => {
                old?.abort();
                return newAbortController;
            });
            return newAbortController.signal;
        }
    }
}
