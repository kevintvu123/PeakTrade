import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserPortfolioThunk } from "../../store/portfolio";


export default function PortfolioChart() {
    const dispatch = useDispatch()

    const [allStockChartData, setAllStockChartData] = useState()

    const portfolio = useSelector((state) => state.portfolio)

    useEffect(() => {
        dispatch(getUserPortfolioThunk())
    }, [dispatch])

    if (Object.keys(portfolio).length === 0) return null

    const YHapiKey = process.env.REACT_APP_YH_API_KEY

    async function get1DayData(symbol) {
        const response = await fetch(`https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v3/get-chart?interval=5m&symbol=${symbol}&range=1d&region=US&includePrePost=false&useYfid=true&includeAdjustedClose=true&events=capitalGain%2Cdiv%2Csplit`, {
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

                const data = closePrices.map((price, index) => ({
                    date: dates[index],
                    value: price
                }))

                console.log(data)
            })
            .catch(err => console.error('error:' + err))
    }

    let ownedStocksSymbols = []
    portfolio['stocksArr'].forEach(stock => ownedStocksSymbols.push(stock.ticker))

    // console.log(ownedStocksSymbols)

    function getAllStock1DayData() {
        const symbol = ownedStocksSymbols.shift();
        get1DayData(symbol).then(() => {
            if (ownedStocksSymbols.length > 0) {
                setTimeout(getAllStock1DayData, 1000);
            }
        });
    }

    // getAllStock1DayData()

    return (
        <div>
            Portfolio Chart
        </div>
    )
}