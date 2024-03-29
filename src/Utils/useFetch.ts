import { useEffect, useState } from "react";
import { ENDPOINT, ResponseTransformFunc } from './fetchCommon';

export interface FetchResult<T> {
    loading: boolean,
    data: T,
    error: Error | null,
    reloadCallback: () => void,
    overrideData: (overrideValue: T) => void,
}

type VoidFunc = () => void;

export default <T,>(url: string, defaultValue: T, init: RequestInit={}, transform? : ResponseTransformFunc<T>): FetchResult<T> => {
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<T>(defaultValue);
    const [error, setError] = useState<Error | null>(null);
    const [reloadMark, setReloadMark] = useState<number>(1);
    const [abortController, setAbortController] = useState<AbortController>(new AbortController());

    const setDataNoLoading = (value: T) => {
        // console.log(`set data`);
        setData(value);
        setError(null);
        setLoading(false);
    };
    const setErrorNoLoading = (error: Error) => {
        // console.log(error);
        // console.log(error.name);
        // if(error instanceof DOMException && error.name === 'AbortError') {
        //     setData(defaultValue);
        //     setError(null);
        //     setLoading(false);
        //     return;
        // }

        if(!(error instanceof DOMException && error.name === 'AbortError')) {
            console.error(error);
        }

        // console.log(`set error`);
        setError(error);
        setData(defaultValue);
        setLoading(false);
    };

    useEffect((): VoidFunc => {
        setLoading(true);
        setError(null);
        const newController = new AbortController();
        setAbortController(oldController => {
            oldController.abort();
            return newController;
        });

        fetch(`${ENDPOINT}${url}`, {...init, signal: newController.signal})
            .then((response: Response) => {
                const {status, statusText}: {status: number, statusText: string} = response;
                if(status < 200 || status >= 300) {
                    let message = `[${status}] ${statusText}`;
                    response
                        .json()
                        .then(({message: serverMsg}: {message: string}) => {
                            if(serverMsg !== undefined && serverMsg !== null && serverMsg !== '') {
                                message = serverMsg;
                            }
                            const error = new Error(message);
                            setErrorNoLoading(error);
                        })
                        .catch(e => {
                            console.log(e);
                            const error = new Error(message);
                            setErrorNoLoading(error);
                        });
                    return;
                }

                if(transform)
                {
                    transform(response)
                        .then(setDataNoLoading)
                        .catch(setErrorNoLoading);
                    return;
                }

                response
                    .json()
                    .then(result => setDataNoLoading(result as T))
                    .catch(setErrorNoLoading);
            })
            .catch(setErrorNoLoading);
        // .finally((): void => setLoading(false));

        return () => abortController.abort();
    }, [url, reloadMark]);

    return {
        loading,
        data,
        error,
        reloadCallback: () => {
            // abortController.abort();
            // setAbortController(new AbortController());
            // setAbortController(oldController => {
            //     oldController.abort();
            //     return new AbortController();
            // })
            setReloadMark(orl => -orl);
        },
        overrideData: newValue => {
            // setAbortController(oldController => {
            //     oldController.abort();
            //     return new AbortController();
            // });
            abortController.abort();
            setData(newValue);
            setLoading(false);
            setError(null);
        }
    };
}
