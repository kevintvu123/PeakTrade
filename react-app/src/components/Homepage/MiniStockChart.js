import { useEffect, useState } from 'react';
import Chart from "react-apexcharts"

import PulseLoader from "react-spinners/PulseLoader"
import styles from '../cssModules/MiniStockChart.module.css'

export default function MiniStockChart({ stockTicker }) {

    const [isLoading, setIsLoading] = useState(false)
    const [chartOptions, setChartOptions] = useState({})

    useEffect(() => {
        setIsLoading(false)
        const YHapiKey = process.env.REACT_APP_YH_API_KEY
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': YHapiKey,
                'X-RapidAPI-Host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
            }
        };

        const fetchData = async () => await fetch(`https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v3/get-chart?interval=60m&symbol=${stockTicker}&range=1mo&region=US&includePrePost=false&useYfid=true&includeAdjustedClose=true&events=capitalGain%2Cdiv%2Csplit`, options)
            //Parsing JSON into JS Object
            .then(response => response.json())
            .then(response => {
                // Normalizing data from YH Finance for 1 month in 30 min intervals
                const formattedData = response.chart.result[0].indicators.quote[0].close.map((price, index) => ({
                    x: new Date(response.chart.result[0].timestamp[index] * 1000).toLocaleString(undefined, {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                    }),
                    y: price
                }));

                //Creating array of dates to specify available dates on x axis in Apex Chart
                const dates = formattedData.map(dataPoint => dataPoint.x)

                //Setting up chart options and styling for Apex Charts
                setChartOptions(
                    {
                        chart: {
                            type: 'line',
                            animations: { enabled: false },
                            zoom: { enabled: false },
                            parentHeightOffset: 27,
                            offsetX: -5,
                            toolbar: { show: false },
                        },
                        series: [{
                            data: formattedData
                        }],
                        colors: ['#5ac53b'],
                        xaxis: {
                            type: 'category',
                            categories: dates,
                            position: 'top',
                            labels: {
                                show: false
                            },
                            axisTicks: {
                                show: false
                            },
                        },
                        yaxis: {
                            labels: { show: false },
                        },
                        stroke: {
                            curve: 'smooth',
                            width: 1.5,
                        },
                        grid: { show: false },
                        tooltip: {
                            enabled: false,
                            x: { show: false },
                            items: { display: 'none' },
                        },

                    }
                )

                //Chart will only load after data has been fetched (prevents Error)
                setIsLoading(true)

            })
            .catch(err => console.error(err));

        fetchData()
    }, [])

    return (
        <div className={styles.miniChartLoadingContainer}>
            {!isLoading && (
                <PulseLoader color="#5ac53b" size={5}/>
            )}
            {isLoading && (
                <Chart options={chartOptions} series={chartOptions.series} height={100} width={'140%'} className={styles.stockChart}/>
            )}
        </div>
    )
}