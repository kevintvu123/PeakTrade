import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getUserPortfolioThunk } from "../../store/portfolio"

import OwnedStockPrice from "./OwnedStockPrice"
import MiniStockChart from "./MiniStockChart"

import styles from '../cssModules/OwnedStocks.module.css'
import { useHistory } from "react-router-dom"

export default function OwnedStocks() {
    const dispatch = useDispatch()
    const history = useHistory()

    const portfolio = useSelector((state) => state.portfolio)

    useEffect(() => {
        dispatch(getUserPortfolioThunk())
    }, [dispatch])

    if (Object.keys(portfolio).length === 0) return null

    const stocksArr = portfolio.stocksArr

    const redirectStock = (stockTicker) => {
        history.push(`/stocks/${stockTicker}`)
    }

    return (
        <div className={styles.stockListContainer}>
            <div className={styles.ownedStocksHeader}>
                Stocks
            </div>
            {stocksArr.map((stock) => {
                return (
                    <div
                        className={styles.eachOwnedStockContainer}
                        key={stock.ticker}
                        onClick={() => { redirectStock(stock.ticker) }}
                    >
                        <div className={styles.stockTickerSharesContainer}>
                            <div>{stock.ticker}</div>
                            <div>{stock.amount} Shares</div>
                        </div>
                        <div className={styles.miniStockChartContainer}>
                            <MiniStockChart stockTicker={stock.ticker} />
                        </div>
                        <div className={styles.stockPriceContainer}>
                            <OwnedStockPrice stockTicker={stock.ticker} />
                        </div>
                    </div>
                )
            })}

        </div>
    )
}