import React, { useEffect, useCallback } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4maps from '@amcharts/amcharts4/maps';
import am4themes_dark from '@amcharts/amcharts4/themes/dark';
import am4geodata_worldLow from '@amcharts/amcharts4-geodata/worldLow';

function WorldMap(props) {
    console.log(props);
    const animateBullet = useCallback((circle) => {
        let animation = circle.animate(
            [
                { property: 'scale', from: 1, to: 5 },
                { property: 'opacity', from: 1, to: 0 },
            ],
            1000,
            am4core.ease.circleOut
        );
        animation.events.on('animationended', function (event) {
            animateBullet(event.target.object);
        });
    }, []);
    useEffect(() => {
        am4core.useTheme(am4themes_dark);
        let chart = am4core.create('world-map', am4maps.MapChart);
        am4core.ready(function () {
            chart.geodata = am4geodata_worldLow;
            chart.projection = new am4maps.projections.Miller();
            chart.seriesContainer.draggable = false;
            chart.seriesContainer.resizable = false;
            chart.maxZoomLevel = 1;

            let polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
            polygonSeries.exclude = ['AQ'];
            polygonSeries.useGeodata = true;

            let polygonTemplate = polygonSeries.mapPolygons.template;
            polygonTemplate.tooltip = false;
            polygonTemplate.interactionsEnabled = false;

            let hs = polygonTemplate.states.create('hover');
            hs.properties.fill = chart.colors.getIndex(0);

            let imageSeries = chart.series.push(new am4maps.MapImageSeries());
            imageSeries.mapImages.template.propertyFields.longitude = 'longitude';
            imageSeries.mapImages.template.propertyFields.latitude = 'latitude';
            imageSeries.mapImages.template.tooltipText = `[bold]{label}[/]\n{customTooltip}`;

            let circle = imageSeries.mapImages.template.createChild(am4core.Circle);
            circle.radius = 0.3;
            circle.propertyFields.fill = 'color';

            let circle2 = imageSeries.mapImages.template.createChild(am4core.Circle);
            circle2.radius = 0.3;
            circle2.propertyFields.fill = 'color';

            circle2.events.on('inited', function (event) {
                animateBullet(event.target);
            });

            imageSeries.data = props.processedApiData;
        });
        return () => {
            chart.dispose();
        };
    }, [animateBullet, props.processedApiData]);

    return (
        <div
            id="world-map"
            style={{
                height: window.innerHeight,
            }}></div>
    );
}

export default WorldMap;
