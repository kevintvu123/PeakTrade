import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { getUserPortfolioThunk } from "../store/portfolio"
import BuyStockForm from "./Forms/BuyStockForm"
import SellStockForm from "./Forms/SellStockForm"

export default function StockDetail() {
    const dispatch = useDispatch()
    const { stockTicker } = useParams()

    const [hasSubmitted, setHasSubmitted] = useState(false)
    const [stockName, setStockName] = useState("")
    const [stockPrice, setStockPrice] = useState()

    const portfolio = useSelector((state) => state.portfolio)

    useEffect(() => {
        dispatch(getUserPortfolioThunk())
    }, [dispatch, hasSubmitted])

    const apiKey = process.env.REACT_APP_API_KEY
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockTicker}&apikey=${apiKey}`
    const url2 = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${stockTicker}&apikey=${apiKey}`

    useEffect(() => {
        fetch(url)
            .then(res => res.json())
            .then((result) => {
                setStockPrice(result['Global Quote']['05. price'])
            })
        fetch(url2)
            .then(res => res.json())
            .then((result) => {
                setStockName(result['Name'])
            })
    })

    if (Object.keys(portfolio).length === 0) return null

    const ownedStockObj = portfolio.stocks[stockTicker]

    return (
        <div>
            <h1>{stockTicker}</h1>
            <h2>{stockName}</h2>
            <h2>${stockPrice}</h2>
            <div>
                <BuyStockForm setHasSubmitted={setHasSubmitted} stockName={stockName} stockPrice={stockPrice} />
                <SellStockForm setHasSubmitted={setHasSubmitted} stockName={stockName} stockPrice={stockPrice} />
                <h1>
                    User Portfolio
                </h1>
                {(Object.keys(portfolio.stocks).length === 0) && (
                    <div>
                        You have no stonks!!
                    </div>
                )}
                {ownedStockObj && (
                    <div>
                        <h2>
                            Buying Power: ${portfolio.buyingPower}
                        </h2>
                        <h2>
                            {stockTicker} owned: {ownedStockObj.amount}
                        </h2>
                        <h2>
                            {stockTicker} averageValue: {ownedStockObj.avgStockValue}
                        </h2>
                    </div>
                )}
            </div>
        </div>
    )
}