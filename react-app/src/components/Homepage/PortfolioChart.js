import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserPortfolioThunk } from "../../store/portfolio";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';


export default function PortfolioChart() {
    const dispatch = useDispatch()

    const [allStockChartData, setAllStockChartData] = useState([])
    const [loaded, setLoaded] = useState(false)

    const portfolio = useSelector((state) => state.portfolio)
    const stocksArr = portfolio.stocksArr
    const apiKey = process.env.REACT_APP_API_KEY

    useEffect(() => {
        dispatch(getUserPortfolioThunk())
    }, [dispatch])


    useEffect(() => {
        if (!stocksArr) return null

        const dataPoints = []
        async function fetchData() {
            for (const stock of stocksArr) {
                await fetch(
                    `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${stock.ticker}&interval=5min&apikey=${apiKey}`
                )
                    .then(res => res.json())
                    .then(res => {
                        const timeSeries = (res["Time Series (5min)"])
                        const stockArr = []
                        for (const time in timeSeries) {
                            if (timeSeries.hasOwnProperty(time)) {
                                const date = new Date(time)
                                const month = date.toLocaleDateString('en-US', { month: 'short' });
                                const day = date.toLocaleDateString('en-US', { day: 'numeric' });
                                const formattedTime = date.toLocaleTimeString('en-US', {
                                    hour: 'numeric',
                                    minute: 'numeric',
                                    hour12: true,
                                });
                                stockArr.push({
                                    date: `${month} ${day} ${formattedTime}`,
                                    value: ((parseFloat(timeSeries[time]['4. close']) * stock.amount).toFixed(2)),
                                });

                            }
                        }
                        if (!dataPoints.length) {
                            dataPoints.push(stockArr)
                        } else {
                            for (let i = 0; i < stockArr.length; i++) {
                                stockArr[i].value = ((parseFloat(stockArr[i].value)) + (parseFloat(dataPoints[0][i].value))).toFixed(2)
                            }
                            dataPoints.push(stockArr)
                        }
                    })
                    .then(() => { setAllStockChartData(dataPoints) })
                    .then(() => setLoaded(true))
                    .catch(err => console.error('error:' + err))
            }
        }
        fetchData()
    }, [stocksArr, apiKey])

    if (Object.keys(portfolio).length === 0) return null

    const currentAllStockData = allStockChartData[allStockChartData.length - 1]

    const CustomTooltip = (props) => { //Used by Rechart library to bring up date and set price when mousing over data points
        if (props.active) {
            if (props.payload) {
                const data = props.payload[0].payload;
                return (
                    <div>
                        {data.date}
                        <div>
                            ${data.value}
                        </div>
                    </div>
                );
            }
        }
        return null
    };

    return (
        <>
            {loaded &&
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={currentAllStockData} transitionDuration={0}>
                        <XAxis dataKey="date" hide />
                        <YAxis domain hide />
                        <Tooltip content={<CustomTooltip />} wrapperStyle={{ border: '0' }} />
                        <Line type="monotone" dataKey="value" stroke="#00C805" strokeWidth={1.5} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            }
        </>
    )
}