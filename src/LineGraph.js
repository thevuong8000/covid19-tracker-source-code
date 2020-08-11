import React, {useState, useEffect} from 'react'
import { Line } from 'react-chartjs-2';
import numeral from "numeral"
import { casesTypeColors } from './main'

const options = {
    legend:{
        display: false,
    },
    elements: {
        points: {
            radius: 0,
        },
    },
    maintainAspectRatio: false,
    tooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
            label: function(tooltipItem, data){
                return numeral(tooltipItem.value).format("+0,0");
            },
        },
    },
    scales: {
        xAxes: [
            {
                type: "time",
                time: {
                    format: "MM/DD/YY",
                    tooltipFormat: 'll',
                },
            },
        ],
        yAxes: [
            {
                gridLines: {
                    display: false,
                },
                ticks: {
                    callback: function(value, index, values){
                        return numeral(value).format("0a");
                    },
                },
            },
        ],
    }
}


function LineGraph({type, countryCode}) {
    const [data, setData] = useState({});
    const [obtained, setObtained] = useState(true)

    const buildChartData = (data, type) => {
        const chartData = [];
        let lastDataPoint;

        for(let date in data[type]){
            if(lastDataPoint){
                const newPoint = {
                    x: date,
                    y: data[type][date]- lastDataPoint
                } 
                chartData.push(newPoint)
            }
            lastDataPoint = data[type][date]
            
        }
        return chartData;
    }
    

    useEffect(() => {
        const fetchData = async () => {
            const url = countryCode === 'worldwide' 
						? "https://disease.sh/v3/covid-19/historical/all?lastdays=60"
						: `https://disease.sh/v3/covid-19/historical/${countryCode}?lastdays=60`;
            await fetch(url)
            .then(response => response.json())
            .then(data => {
                if(Object.keys(data).length === 1){
                    setObtained(false);
                } else{
                    if(countryCode === 'worldwide') setData(buildChartData(data, type))
                    else setData(buildChartData(data['timeline'], type))
                    setObtained(true)
                }
            })
        }
        fetchData();
    }, [type, countryCode]);

    return (
        <div>
            {data.length > 0 && obtained ? (
                <Line
                    options={options}
                    data={{
                        datasets: [
                            {
                                backgroundColor: casesTypeColors[type].color,
                                // backgroundColor: "rgba(204, 16, 52, 0.4)",
                                borderColor: casesTypeColors[type].hex,
                                data: data,
                            },
                        ]
                    }}
                ></Line>
            ) : (
                <h3 className='no_data'>There is no data for the last 60 days</h3>
            )}
            
        </div>
    )
}

export default LineGraph
