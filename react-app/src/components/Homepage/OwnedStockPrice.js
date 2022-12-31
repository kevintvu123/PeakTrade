import { useEffect, useState } from "react"

export default function OwnedStockPrice({ stockTicker }) {

    const [stockPrice, setStockPrice] = useState()

    const apiKey = process.env.REACT_APP_API_KEY
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockTicker}&apikey=${apiKey}`

    useEffect(() => {
        fetch(url)
            .then(res => res.json())
            .then(result => {
                setStockPrice(result['Global Quote']['05. price'])
            })
    })

    return (
        <div>
            ${parseFloat(stockPrice).toFixed(2)}
        </div>
    )
}