import { useEffect, useState } from "react"

export default function OwnedStockPrice({ stockTicker }) {

    const [stockPrice, setStockPrice] = useState()

    // const YHapiKey = process.env.REACT_APP_YH_API_KEY
    // const yhUrl = `https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-quotes?region=US&symbols=${stockTicker}`
    // useEffect(() => {
    //     fetch(yhUrl, {
    //         "method": "GET",
    //         "headers": {
    //             'X-RapidAPI-Key': YHapiKey,
    //             'X-RapidAPI-Host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
    //         }
    //     })
    //         .then(res => res.json())
    //         .then(res => {
    //             setStockPrice(res['quoteResponse']['result'][0]['regularMarketPrice'])
    //         })
    //         .catch(err => console.error('error:' + err))
    // }, [yhUrl, YHapiKey])

    const apiKey = process.env.REACT_APP_API_KEY
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockTicker}&apikey=${apiKey}`
    useEffect(() => {
        fetch(url)
            .then(res => res.json())
            .then(result => {
                setStockPrice(result['Global Quote']['05. price'])
            })
            .catch(err => console.error(err))
    }, [url])

    return (
        <div>
            ${parseFloat(stockPrice).toFixed(2)}
        </div>
    )
}