import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getUserPortfolioThunk } from "../../store/portfolio"


export default function PortfolioValue() {
    const dispatch = useDispatch()

    const [ownedStocksMarketVal, setOwnedStocksMarketVal] = useState(0)

    const portfolio = useSelector((state) => state.portfolio)
    const apiKey = process.env.REACT_APP_API_KEY
    const stocksArr = portfolio.stocksArr

    useEffect(() => {
        dispatch(getUserPortfolioThunk())
    }, [dispatch])

    useEffect(() => { //fetches price from AlphaVantage for each stock user owns and adds them up
        async function fetchData() {
            if (!stocksArr) return null

            let sum = 0;
            for (const stock of stocksArr) {
                const response = await fetch(
                    `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stock.ticker}&apikey=${apiKey}`
                );
                const json = await response.json();
                const price = (json['Global Quote']['05. price']) * stock.amount;
                sum += parseFloat(price);
            }
            setOwnedStocksMarketVal(sum);
        }
        fetchData();
    }, [stocksArr, apiKey]);

    if (Object.keys(portfolio).length === 0) return null

    const buyingPower = ((portfolio.buyingPower.toFixed(2)))

    function formatCommas(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    return (
        <div>
            ${formatCommas((parseFloat(ownedStocksMarketVal) + parseFloat(buyingPower)).toFixed(2))}
        </div>
    )
}