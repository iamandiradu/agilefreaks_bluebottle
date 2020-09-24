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

const getToken = async () => {
    const response = await axios.post(urls.tokenURL, {
        timeout: 1000,
    });
    return response.data.token;
};

const getData = async (token) => {
    try {
        const response = await axios.get(`${urls.dataURL}?token=${token}`, {
            headers: {
                Accept: 'application/json',
            },
            timeout: 1000,
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            const token = await getToken();
            return await getData(token);
        }
        return error;
    }
};

export default {
    getToken,
    getData,
};
