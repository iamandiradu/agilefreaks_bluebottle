import React, { useEffect, useCallback } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_dark from '@amcharts/amcharts4/themes/dark';

function XYChart(props) {
    useEffect(() => {
        am4core.useTheme(am4themes_dark);
        let chart = am4core.create('xy-graph', am4charts.XYChart);
        props.data.length > 0 &&
            am4core.ready(function () {
                chart.data = props.data;

                let latitudeAxis = chart.xAxes.push(new am4charts.ValueAxis());
                latitudeAxis.title.text = 'Latitude';
                latitudeAxis.min = -90;
                latitudeAxis.max = 90;
                latitudeAxis.strictMinMax = true;

                let longitudeAxis = chart.yAxes.push(new am4charts.ValueAxis());
                longitudeAxis.title.text = 'Longitude';
                longitudeAxis.min = -180;
                longitudeAxis.max = 180;
                longitudeAxis.strictMinMax = true;

                var series = chart.series.push(new am4charts.LineSeries());
                series.dataFields.valueY = 'longitude';
                series.dataFields.valueX = 'latitude';
                series.dataFields.value = 'value';
                series.strokeOpacity = 0;
                series.name = 'Coordinates';

                var bullet = series.bullets.push(new am4charts.CircleBullet());
                bullet.strokeOpacity = 0.2;
                bullet.nonScalingStroke = true;
                bullet.tooltipText = '{customTooltip}';
                bullet.circle.propertyFields.fill = 'color';

                series.heatRules.push({
                    target: bullet.circle,
                    min: 10,
                    max: 150,
                    property: 'radius',
                });

                let valueLabel = series.bullets.push(new am4charts.LabelBullet());
                valueLabel.label.text = '{label}';
                valueLabel.label.fontSize = 20;
                valueLabel.label.maxWidth = 140;
            });
        return () => {
            chart.dispose();
        };
    }, [props.data]);

    return <div id="xy-graph"></div>;
}

export default XYChart;
