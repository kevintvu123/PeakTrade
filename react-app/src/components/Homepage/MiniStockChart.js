import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

export default function MiniStockChart({ stockTicker, setGraphLoading }) {
    const [stockChartData, setStockChartData] = useState()

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
                const closePrices = stockData['indicators']['quote'][0]['close']

                //Normalizing data for Rechart
                const data = closePrices.map((price, index) => ({
                    index: index,
                    value: price
                }))

                setStockChartData(data)
            })
            .then(() => setGraphLoading(false))
            .catch(err => console.error('error:' + err))
    }, [YHapiKey, yhUrl])

    if (!stockChartData) return null

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stockChartData} transitionDuration={100}>
                <XAxis dataKey="date" hide />
                <YAxis domain hide />
                <Line type="monotone" dataKey="value" stroke="#00C805" strokeWidth={1.5} dot={false} />
            </LineChart>
        </ResponsiveContainer>
    )
}