import { useEffect, useState } from "react"
import Chart from "react-apexcharts"


import styles from '../cssModules/Homepage.module.css'

export default function ApexPortfolioChart({ portfolio, setScrollingStockPrice }) {

    const [isLoading, setIsLoading] = useState(false)
    const [chartOptions, setChartOptions] = useState({});

    const stocksArr = portfolio.stocksArr
    const stocksObj = portfolio.stocks

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

        const fetchData = async () => {
            //Set up promises for each stock in user's portfolio
            const promises = stocksArr.map(async (stock) => {
                const response = await fetch(`https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v3/get-chart?interval=60m&symbol=${stock.ticker}&range=1mo&region=US&includePrePost=false&useYfid=true&includeAdjustedClose=true&events=capitalGain%2Cdiv%2Csplit`, options)
                return response.json()
            })

            //Promise.all() to resolve and return array of resolved val from input promises
            //All promises will need to resolve
            const responses = await Promise.all(promises).catch(err => console.error(err));

            const formattedData = [];

            //Overview: Loop through responses and sum up closing prices for each timestamp
            //Iterate through first response object and iterate through timestamp arr
            for (let i = 0; i < responses[0].chart.result[0].timestamp.length; i++) {
                const timestamp = responses[0].chart.result[0].timestamp[i] * 1000;
                let sum = 0;

                //Iterate through each response and sum up the (closing price at timestamp * how many of the stock the user owns)
                for (let j = 0; j < responses.length; j++) {
                    sum += (responses[j].chart.result[0].indicators.quote[0].close[i] * stocksObj[responses[j].chart.result[0].meta.symbol].amount);
                }
                //Add the {x: timestamp(formatted), y: sum}
                formattedData.push({
                    x: new Date(timestamp).toLocaleString(undefined, {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                    y: sum,
                });
            }

            //Creating array of dates to specify available dates on x axis in Apex Chart
            const dates = formattedData.map(dataPoint => dataPoint.x)

            //Setting up chart options and styling for Apex Charts
            setChartOptions(
                {
                    chart: {
                        type: 'line',
                        animations: { enabled: false },
                        zoom: { enabled: false },
                        parentHeightOffset: 0,
                        toolbar: { show: false },
                        events: {
                            mouseMove: function (event, chartContext, config) {
                                // console.log(config.dataPointIndex)
                                if (config.dataPointIndex >= 0) {
                                    setScrollingStockPrice(parseFloat(formattedData[config.dataPointIndex].y).toFixed(2))
                                }
                            },
                            mouseLeave: () => {
                                setScrollingStockPrice()
                            }
                        }
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
                        width: 2,
                    },
                    grid: { show: false },
                    tooltip: {
                        x: { show: false },
                        items: { display: 'none' },
                    },

                }
            )
            //Chart will only load after data has been fetched (prevents Error)
            setIsLoading(true)
        }

        fetchData()
    }, [])

    return (
        <div className={styles.portfolioChartInnerContainer}>
            {!isLoading && (
                <p>Loading...</p>
            )}
            {isLoading && (
                <Chart options={chartOptions} series={chartOptions.series} height={330} />
            )}
        </div>
    )
}