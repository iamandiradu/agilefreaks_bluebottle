import api from './api';
import urls from './urls';
import axios from 'axios';

jest.mock('axios');

describe('api', () => {
    it('should get the token', async () => {
        axios.post = jest.fn(() => ({ data: { token: '123' } }));
        const token = await api.getToken();
        expect(axios.post).toHaveBeenCalledTimes(1);
        expect(axios.post).toHaveBeenCalledWith(`${urls.apiURL}/tokens`);
        expect(token).toEqual('123');
    });

    it('should get the data', async () => {
        axios.get = jest.fn(() => ({ data: 'coffeeShops' }));
        const data = await api.getData(123);
        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledWith(`${urls.apiURL}/coffee_shops?token=123`, {
            headers: {
                Accept: 'application/json',
            },
        });

        expect(data).toEqual('coffeeShops');
    });
});
