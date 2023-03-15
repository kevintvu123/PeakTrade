import { useEffect, useState } from "react"

export default function PortfolioValue({portfolio}) {

    const [ownedStocksMarketVal, setOwnedStocksMarketVal] = useState(0)

    const apiKey = process.env.REACT_APP_API_KEY
    const stocksArr = portfolio.stocksArr

    //fetches price from AlphaVantage for each stock user owns and sums them up
    useEffect(() => { 
        async function fetchData() {
            if (!stocksArr) return null

            let sum = 0;
            for (const stock of stocksArr) {
                const response = await fetch(
                    `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stock.ticker}&apikey=${apiKey}`
                )
                    .catch(err => console.error(err))
                const json = await response.json();
                const price = (json['Global Quote']['05. price']) * stock.amount;
                sum += parseFloat(price);
            }
            setOwnedStocksMarketVal(sum);
        }
        fetchData();
    }, [stocksArr, apiKey]);

    if (Object.keys(portfolio).length === 0) return null

    return (
        <div>
            {(parseFloat(ownedStocksMarketVal).toFixed(2))}
        </div>
    )
}
