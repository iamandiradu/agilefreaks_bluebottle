import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

import App from './App';
import api from '../../api/api';

jest.mock('../../api/api');
jest.mock('../world-map/world-map.js');
jest.mock('../xy-chart/xy-chart.js');

describe('App', () => {
    let app;

    beforeEach(async () => {
        api.getToken = jest.fn(() => Promise.resolve(123));
        api.getData = jest.fn(() => Promise.resolve([]));
        await act(async () => {
            app = await mount(<App />);
        });
        app.update();
    });

    it('should show loading spinner while loading data', async () => {
        api.getToken = jest.fn(() => Promise.resolve());
        api.getData = jest.fn(() => Promise.resolve());
        await act(async () => {
            app = await mount(<App />);
        });
        expect(app.exists('.spinnerWrapper')).toBeTruthy();
        expect(app.exists('.header')).toBeFalsy();
        expect(app.exists('.formWrapper')).toBeFalsy();
        api.getToken = jest.fn(() => Promise.resolve(123));
        api.getData = jest.fn(() => Promise.resolve([]));
        await act(async () => {
            app = await mount(<App />);
        });
        app.update();
        expect(app.exists('.spinnerWrapper')).toBeFalsy();
        expect(app.exists('.app')).toBeTruthy();
    });

    it('should show header after data was loaded', () => {
        expect(app.exists('.header')).toBeTruthy();
        expect(app.exists('.header img.logo')).toBeTruthy();
        expect(app.exists('.header .mapToggle')).toBeTruthy();
        expect(app.find('.header div span').text()).toBe('Coffee Shop Finder Map ');
        expect(app.find('.header div div input').prop('type')).toBe('checkbox');
    });

    it('should render coordinates form', () => {
        expect(app.exists('form')).toBeTruthy();
        expect(app.find('form label.latitudeLabel').text()).toBe('Latitude:');
        expect(app.find('form label.latitudeLabel input').prop('type')).toBe('number');
        expect(app.find('form label.latitudeLabel input').prop('name')).toBe('latitude');
        expect(app.find('form label.longitudeLabel').text()).toBe('Longitude:');
        expect(app.find('form label.longitudeLabel input').prop('type')).toBe('number');
        expect(app.find('form label.longitudeLabel input').prop('name')).toBe('longitude');
    });

    it('should not render map if only 1 coordinate is present', () => {
        act(() => {
            app.find('.latitudeLabel input').simulate('change', {
                target: { value: '45.45' },
            });
        });
        app.update();
        expect(app.find('.latitudeLabel input').prop('value')).toBe('45.45');
        expect(app.exists('#xy-graph')).toBeFalsy();
        expect(app.exists('#world-map')).toBeFalsy();
    });

    it('should render XY Graph if both coordinates are present', async () => {
        act(() => {
            app.find('.longitudeLabel input').simulate('change', {
                target: { value: '54.54' },
            });
        });
        app.update();

        expect(app.find('.longitudeLabel input').prop('value')).toBe('54.54');

        const waitForXYGraph = await app.find('main#xy-graph');
        expect(waitForXYGraph).toBeTruthy();
    });

    it('should toggle mapToggle', async () => {
        expect(app.exists('#switchState-false')).toBeTruthy();
        act(() => {
            app.find('.mapToggle').first().simulate('click');
        });
        app.update();

        const waitForToggle = await app.find('#switchState-true');
        expect(waitForToggle).toBeTruthy();
    });

    it('should render WorldMap', async () => {
        const waitForWorldMap = await app.find('main#world-map');
        expect(waitForWorldMap).toBeTruthy();
    });
});
