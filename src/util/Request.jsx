export const makeError = (internalMessage, code, codeArgs={}) => {
    const error = new Error(internalMessage);
    error.code = code;
    error.codeArgs = codeArgs;
    return error;
};


export const plusError = (error, code, codeArgs) => {
    /* eslint-disable-next-line no-param-reassign */
    error.code = code;
    /* eslint-disable-next-line no-param-reassign */
    error.codeArgs = codeArgs;
    return error;
};


class ResponseWrapper {
  constructor(resp) {
    this.status = resp.status;
    /* eslint-disable-next-line no-underscore-dangle */
    this.__resp = resp;
  }

  json() {
    /* eslint-disable-next-line no-underscore-dangle */
    const {__resp: resp} = this;
    return new Promise((resolve, reject) =>
      resp
        .json()
        .then(resolve)
        .catch(e => reject(plusError(e, -1001, {})))
    );
  }
}


export default (uri, config) => new Promise((resolve, reject) => {
  fetch(uri, config)
    .then(resp => {
      const {status, statusText} = resp;
      if(status < 200 || status >= 300) {
        let message = `[${status}] ${statusText}`;
        resp
          .json()
          .then(({message: serverMsg, code: serverCode, code_args: serverCodeArgs}) => {
            if(serverMsg !== undefined && serverMsg !== null && serverMsg !== '') {
              message = serverMsg;
            }
            // const error = new Error(message);
            const error = makeError(message, serverCode, serverCodeArgs);
            reject(error);
          })
          .catch(e => {
            console.log(e);
            const error = new Error(message);
            reject(error);
          });
      } else {
        resolve(new ResponseWrapper(resp));  // let caller decide what to do, may not be json
      }
    })
    .catch(e => reject(e));
});
