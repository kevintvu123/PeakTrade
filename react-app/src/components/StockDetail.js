import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { getUserPortfolioThunk } from "../store/portfolio"
import BuyStockForm from "./Forms/BuyStockForm"

export default function StockDetail() {
    const dispatch = useDispatch()
    const { stockTicker } = useParams()

    const [hasSubmitted, setHasSubmitted] = useState(false)

    const portfolio = useSelector((state) => state.portfolio)

    useEffect(() => {
        dispatch(getUserPortfolioThunk())
    }, [dispatch, hasSubmitted])

    if (Object.keys(portfolio).length === 0) return null

    const ownedStockObj = portfolio.stocks[stockTicker]
    console.log(ownedStockObj)

    return (
        <div>
            <h1>{stockTicker}</h1>
            <div>
                <BuyStockForm setHasSubmitted={setHasSubmitted} />
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