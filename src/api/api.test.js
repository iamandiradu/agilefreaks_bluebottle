import api from './api';
import seeds from './test-seeds';
import urls from './urls';
import axios from 'axios';

jest.mock('axios');

describe('api', () => {
    it('should get the API token', async () => {
        axios.post.mockResolvedValue({
            data: {
                token: seeds.token,
            },
        });
        const token = await api.getToken();
        expect(axios.post).toHaveBeenCalledTimes(1);
        expect(axios.post).toHaveBeenCalledWith(`${urls.apiURL}/tokens`, {
            timeout: seeds.timeout,
        });
        expect(token).toEqual(seeds.token);
    });

    it('should get the API coffee shops data', async () => {
        axios.get.mockResolvedValue({
            data: seeds.coffeeShopData,
        });
        const data = await api.getData(seeds.token);
        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledWith(`${urls.apiURL}/coffee_shops?token=${seeds.token}`, {
            headers: {
                Accept: 'application/json',
            },
            timeout: seeds.timeout,
        });

        expect(data).toEqual(seeds.coffeeShopData);
    });

    // Timeout
    it('should timeout', async () => {
        axios.get.mockRejectedValueOnce(seeds.mockTimeoutError);
        await api.getData(seeds.token).catch((error) => {
            expect(error).toEqual(seeds.mockTimeoutError);
        });
        expect(axios.get).toHaveBeenCalledWith(`${urls.apiURL}/coffee_shops?token=${seeds.token}`, {
            headers: {
                Accept: 'application/json',
            },
            timeout: 1000,
        });
    });

    // 401 Unauthorized
    it('should handle error status 401', async () => {
        axios.get.mockRejectedValueOnce(seeds.mock401Error);
        await api.getData(seeds.token).catch((error) => {
            expect(error).toEqual(seeds.mock401Error);
        });
        expect(axios.get).toHaveBeenCalledWith(`${urls.apiURL}/coffee_shops?token=${seeds.token}`, {
            headers: {
                Accept: 'application/json',
            },
            timeout: 1000,
        });
    });

    // 503 Service unavailable
    it('should handle error status 503', async () => {
        axios.get.mockRejectedValueOnce(seeds.mock503Error);
        await api.getData(seeds.token).catch((error) => {
            expect(error).toEqual(seeds.mock503Error);
        });
        expect(axios.get).toHaveBeenCalledWith(`${urls.apiURL}/coffee_shops?token=${seeds.token}`, {
            headers: {
                Accept: 'application/json',
            },
            timeout: 1000,
        });
    });

    // 504 Gateway Timeout
    it('should handle error status 504', async () => {
        axios.get.mockRejectedValueOnce(seeds.mock504Error);
        await api.getData(seeds.token).catch((error) => {
            expect(error).toEqual(seeds.mock504Error);
        });
        expect(axios.get).toHaveBeenCalledWith(`${urls.apiURL}/coffee_shops?token=${seeds.token}`, {
            headers: {
                Accept: 'application/json',
            },
            timeout: 1000,
        });
    });
});
