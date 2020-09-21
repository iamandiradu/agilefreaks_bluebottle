import axios from 'axios';
import urls from './urls.js';

let requestRetriesOnFail = 3;
const retryableErrors = [401, 503, 504];

export default {
    getToken: async () => {
        const response = await axios.post(urls.tokenURL, {
            timeout: 1000,
        });
        return response.data.token;
    },
    getData: async (token) => {
        const response = await axios.get(`${urls.dataURL}?token=${token}`, {
            headers: {
                Accept: 'application/json',
            },
            timeout: 1000,
        });
        return response.data;
    },
    retryRequests: (error, onRetryFcn, onErrorFcn) => {
        const errorStatus = error && error.response && error.response.status;
        const isRetryableError = retryableErrors.includes(errorStatus);
        const isTimeout = error.code === 'ECONNABORTED';

        if ((isRetryableError || isTimeout) && requestRetriesOnFail) {
            requestRetriesOnFail -= 1;
            onRetryFcn();
        } else {
            onErrorFcn(true);
        }
    },
};
