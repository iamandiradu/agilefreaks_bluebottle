import axios from 'axios';
import urls from './urls.js';

export default {
    getToken: async () => {
        try {
            const response = await axios.post(urls.tokenURL);
            return response.data.token;
        } catch (error) {
            throw new Error('Unable to get a token.');
        }
    },
    getData: async (token) => {
        try {
            const response = await axios.get(`${urls.dataURL}?token=${token}`, {
                headers: {
                    Accept: 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            const errorStatus = error && error.response && error.response.status;
            let errorMessage = '';
            switch (errorStatus) {
                case 401:
                    errorMessage = '401: Invalid token.';
                    break;
                case 406:
                    errorMessage = '406: Unacceptable Accept format.';
                    break;
                case 503:
                    errorMessage = '503: Service Unavailable';
                    break;
                case 504:
                    errorMessage = '504: Timeout.';
                    break;
                default:
                    errorMessage = 'Unprocessed HTTP status code: ' + errorStatus;
            }

            throw new Error(errorMessage);
        }
    },
};
