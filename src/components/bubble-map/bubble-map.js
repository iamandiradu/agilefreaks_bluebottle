import React from 'react';
import BubbleChart from '@weknow/react-bubble-chart-d3';
import './bubble-map.css';

function BubbleMap(props) {
    return (
        <BubbleChart
            width={window.innerWidth > 700 ? 700 : window.innerWidth}
            height={window.innerHeight}
            padding={window.innerWidth < 400 ? 10 : 200}
            showLegend={false}
            showValue={false}
            showAnimations={false}
            labelFont={{
                family: 'Arial',
                size: 16,
                color: '#fff',
                weight: 'bold',
            }}
            data={props.data}
            overflow={true}></BubbleChart>
    );
}

export default BubbleMap;
