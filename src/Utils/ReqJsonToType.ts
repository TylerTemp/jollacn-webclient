import { ENDPOINT } from './fetchCommon';

const Req = (uri: string, config: RequestInit={}): Promise<Response> => (
    new Promise<Response>((resolve, reject) => {
        fetch(`${ENDPOINT}${uri}`, config)
            .then(resp => {
                console.log(`fetched ${uri}`);
                const {status, statusText} = resp;
                if(status < 200 || status >= 300) {
                    let message = `[${status}] ${statusText}`;
                    resp
                        .json()
                        .then(({message: serverMsg}) => {
                            if(serverMsg !== undefined && serverMsg !== null && serverMsg !== '') {
                                message = serverMsg;
                            }
                            const error = new Error(message);
                            reject(error);
                        })
                        .catch(e => {
                            console.log(e);
                            const error = new Error(message);
                            reject(error);
                        });
                } else {
                    resolve(resp);  // let caller decide what to do, may not be json
                }
            })
            .catch(reject);
            // .catch(e => {
            //     if(e instanceof DOMException && e.name === 'AbortError') {
            //         console.log(`abort ${uri}`);
            //     }
            //     else
            //     {
            //         reject(e);
            //     }
            // });
    })
);

export default <T>(uri: string, config: RequestInit={}): Promise<T> => Req(uri, config)
    .then(resp => resp.json())
    .then(json => json as T);
