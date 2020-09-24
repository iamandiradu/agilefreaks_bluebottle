import axiosRetry, { isNetworkOrIdempotentRequestError } from 'axios-retry';
import axios from 'axios';
import urls from './urls.js';

let requestRetriesOnFail = 3;

axiosRetry(axios, {
    retries: requestRetriesOnFail,
    shouldResetTimeout: true,
    retryCondition: (error) =>
        isNetworkOrIdempotentRequestError(error) || error.code === 'ECONNABORTED',
});

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
};
