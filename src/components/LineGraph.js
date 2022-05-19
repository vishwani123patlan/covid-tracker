import { blue, red } from '@material-ui/core/colors';
import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import {CategoryScale, registerables} from 'chart.js'; 
import Chart from 'chart.js/auto';
import { rgbToHex } from '@material-ui/core';
Chart.register(CategoryScale);
function LineGraph({graphType}) {
    const [data, setData] = useState({});
    const [recoveredData, setRecoveredData] = useState({});
    const [deathData, setDeathData] = useState({});

    const buildChartData = (data, casesType="cases") => {
        console.log("hello", data)
        const chartData = [];
        let lastPointdata;
        for(let date in data[casesType]) {
            if(lastPointdata){
                const newDataPoint = {
                    x: date,
                    y: data[casesType][date] - lastPointdata        
                }
                chartData.push(newDataPoint);
            }
            lastPointdata = data[casesType][date];
        }
        return chartData;
    };

    useEffect(() => {
        axios.get("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
        .then((response) => {
            const chartdata = buildChartData(response.data)
            const chartRecoveredData = buildChartData(response.data, "recovered")
            const chartDeathdData = buildChartData(response.data, "deaths")
            setData(chartdata);
            setRecoveredData(chartRecoveredData);
            setDeathData(chartDeathdData)
        });
    }, []);

  return (
    <div>
        <Line data={
            {
            options: {
                legend: { display: false },
                title: {
                    display: true,
                    text: 'Covid-19 Cases'
                }
            },
            datasets: [{
                backgroundColor: "rgba(222, 71, 33)",
                borderColor: "#57de21",
                type: graphType,
                label: "Covid-19 Cases",
                data: data,
            },
            {
                backgroundColor: "rgba(86, 214, 120)",
                borderColor: "#212422",
                type: graphType,
                label: "Covid-19 Recovered Cases",
                data: recoveredData,
            },
            {
                backgroundColor: "rgba(42, 42, 245)",
                borderColor: "#212422",
                type: graphType,
                label: "Covid-19 Deaths",
                data: deathData,
            }
            ],
        }} />
    </div>
  )
}

export default LineGraph