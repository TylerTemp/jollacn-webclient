import { useState } from "react"

export default (): [number, () => void] => {
    const [retryKey, setRetryKey] = useState<number>(1);
    return [
        retryKey,
        (): void => setRetryKey(old => -old),
    ];
}