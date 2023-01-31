import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
import { getUserPortfolioThunk } from "../../store/portfolio"

import OwnedStockPrice from "./OwnedStockPrice"
import MiniStockChart from "./MiniStockChart"
import CreateWatchlistForm from "../Forms/CreateWatchlistForm"

import styles from '../cssModules/OwnedStocks.module.css'
import plusIcon from '../../assets/plus-watchlist-icon.png'
import { getUserWatchlistThunk } from "../../store/watchlist"

export default function OwnedStocks() {
    const dispatch = useDispatch()
    const history = useHistory()

    const [showCreateWatchlist, setShowCreateWatchlist] = useState(false)

    const portfolio = useSelector((state) => state.portfolio)
    const watchlist = useSelector((state) => state.watchlist)

    useEffect(() => {
        dispatch(getUserPortfolioThunk())
        dispatch(getUserWatchlistThunk())
    }, [dispatch])

    if (Object.keys(portfolio).length === 0 || Object.keys(watchlist).length === 0) return null

    const stocksArr = portfolio.stocksArr
    const watchlistArr = watchlist.watchlistsArr

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
            <div className={styles.watchlistHeader}>
                <div>
                    Lists
                </div>
                <div className={styles.plusIconContainer} onClick={() => setShowCreateWatchlist((prevValue) => !prevValue)}>
                    <img src={plusIcon} alt='plus icon' />
                </div>
            </div>
            {showCreateWatchlist && (
                <div className={styles.createWatchlistFormDiv}>
                    <CreateWatchlistForm setShowCreateWatchlist={setShowCreateWatchlist} />
                </div>
            )}
            {watchlistArr.map((watchlist) => {
                return (
                    <div className={styles.watchlistDiv}>
                        <div>{watchlist.name}</div>
                    </div>
                )
            })}
        </div>
    )
}
