const seeds = {
    token: '123tokenmock123',
    timeout: 1000,
    coffeeShopData: [
        {
            id: 1,
            created_at: '2020-09-01T06:11:33.024Z',
            updated_at: '2020-09-01T06:11:33.024Z',
            name: 'Blue Bottle Seattle',
            x: '47.581',
            y: '-122.316',
        },
    ],
    mockTimeoutError: {
        error: {
            code: 'ECONNABORTED',
        },
    },
    mock401Error: {
        error: {
            response: {
                status: 401,
                statusText: 'Unauthorized',
            },
        },
    },
    mock503Error: {
        error: {
            response: {
                status: 503,
                statusText: '"Service Unavailable"',
            },
        },
    },
};

export default seeds;
