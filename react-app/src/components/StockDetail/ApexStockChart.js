import { useEffect, useState } from "react"
import Chart from "react-apexcharts"

export default function ApexStockChart({ stockTicker, setScrollingStockPrice }) {

    const [isLoading, setIsLoading] = useState(false)
    const [chartOptions, setChartOptions] = useState({})

    // useEffect hook to make the API request and update the state variable data
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
                // Normalizing data from YH Finance for 1 month in 60 min intervals
                const formattedData = response.chart.result[0].indicators.quote[0].close.map((price, index) => ({
                    x: new Date(response.chart.result[0].timestamp[index] * 1000),
                    y: price
                }));

                //Setting up chart options and styling for Apex Charts
                setChartOptions(
                    {
                        chart: {
                            type: 'line',
                            animations: { enabled: false },
                            zoom: { enabled: false },
                            toolbar: { show: false },
                            events: {
                                mouseMove: function (event, chartContext, config) {
                                    // console.log(config.dataPointIndex)
                                    if (config.dataPointIndex >= 0) {
                                        setScrollingStockPrice(formattedData[config.dataPointIndex].y)
                                    }
                                },
                                mouseLeave: () => {
                                    setScrollingStockPrice()
                                }
                            }
                        },
                        series: [{
                            data: formattedData,
                        }],
                        colors: ['#5ac53b'],
                        xaxis: {
                            type: 'datetime',
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
                            width: 2,
                        },
                        grid: { show: false },
                        tooltip: {
                            enabled: true,
                            items: { display: 'none' },
                            x: { show: false },
                        },

                    }
                )

                //Chart will only load after data has been fetched (prevents Error)
                setIsLoading(true)

            })
            .catch(err => console.error(err));

        fetchData()
    }, [stockTicker])

    return (
        <div>
            {!isLoading && (
                <p>Loading...</p>
            )}
            {isLoading && (
                <Chart options={chartOptions} series={chartOptions.series} height={295} />
            )}
        </div>
    )
}