import axios from 'axios';
import urls from './urls.js';

export default {
    getToken: async () => {
        try {
            const response = await axios.post(`${urls.apiURL}/tokens`);
            return response.data.token;
        } catch (error) {
            console.error(error);
        }
    },
    getData: async (token) => {
        try {
            const response = await axios.get(`${urls.apiURL}/coffee_shops?token=${token}`, {
                headers: {
                    Accept: 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            const errorStatus = error.response.status;
            switch (errorStatus) {
                case 401:
                    console.log('401: Invalid token.');
                    break;
                case 406:
                    console.log('406: Unacceptable Accept format.');
                    break;
                case 503:
                    console.log('503: Service Unavailable');
                    break;
                case 504:
                    console.log('504: Timeout.');
                    break;
                default:
                    console.log('Unprocessed HTTP status code: ', errorStatus);
            }
        }
    },
};
