import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import styles from '../cssModules/StockDetail.module.css'


export default function StockChart({ stockTicker, setScrollingStockPrice }) {

    const [stockChartData, setStockChartData] = useState()
    const [fetchLoaded, setFetchLoaded] = useState(false)

    const YHapiKey = process.env.REACT_APP_YH_API_KEY
    const yhUrl = `https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v3/get-chart?interval=5m&symbol=${stockTicker}&range=1d&region=US&includePrePost=false&useYfid=true&includeAdjustedClose=true&events=capitalGain%2Cdiv%2Csplit`

    useEffect(() => {
        fetch(yhUrl, {
            "method": "GET",
            "headers": {
                'X-RapidAPI-Key': YHapiKey,
                'X-RapidAPI-Host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
            }
        })
            .then(res => res.json())
            .then(res => {
                const stockData = (res['chart']['result'][0])
                const dates = stockData['timestamp'].map(date => new Date(date * 1000).toLocaleString(undefined, {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                }))
                const closePrices = stockData['indicators']['quote'][0]['close']

                //Normalizing data for Rechart
                const data = closePrices.map((price, index) => ({
                    date: dates[index],
                    value: price
                }))

                setStockChartData(data)
            })
            .then(() => setFetchLoaded(true))
            .catch(err => console.error('error:' + err))
    }, [stockTicker, YHapiKey, yhUrl])

    if (!stockChartData) return null

    const CustomTooltip = (props) => { //Used by Rechart library to bring up date and set price when mousing over data points
        if (props.active) {

            if (props.payload[0]) {
                const data = props.payload[0].payload;
                setScrollingStockPrice(data.value)
                return (
                    <div>
                        {data.date}
                    </div>
                );
            }

        }

        setScrollingStockPrice() //necessary to bring back current market price
        return null;
    };

    return (
        <>
            {!fetchLoaded &&
                <div className={styles.stockDetailChartLoadingContainer}>
                    <div className={styles.loadingSpinner}></div>
                </div>
            }
            {fetchLoaded &&
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stockChartData} transitionDuration={0}>
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