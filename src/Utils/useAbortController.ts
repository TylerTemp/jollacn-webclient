import { useEffect, useState } from "react";

export default() => {
    const [abortController, setAbortController] = useState<AbortController>(new AbortController());
    useEffect(() => {
        return () => abortController.abort();
    }, []);

    return (): AbortSignal => {
        const newAbortController = new AbortController();
        setAbortController(old => {
            old.abort();
            return newAbortController;
        });
        return newAbortController.signal;
    };
}
