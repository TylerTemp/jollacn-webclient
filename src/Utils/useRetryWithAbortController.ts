import { useEffect, useState } from "react";

export default() => {
    const [abortController, setAbortController] = useState<AbortController>(new AbortController());
    const [retryKey, setRetryKey] = useState<number>(1);
    useEffect(() => {
        return () => abortController.abort();
    }, []);

    return {
        retryKey,
        doRetry: setRetryKey(old => -old),
        // abortController,
        doAbort: () => {
            const newAbortController = new AbortController();
            setAbortController(old => {
                old.abort();
                return newAbortController;
            });
            return newAbortController.signal;
        }
    }
}
