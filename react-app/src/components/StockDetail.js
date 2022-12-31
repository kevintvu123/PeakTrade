import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { getUserPortfolioThunk } from "../store/portfolio"
import BuyStockForm from "./Forms/BuyStockForm"
import SellStockForm from "./Forms/SellStockForm"
import styles from './cssModules/StockDetail.module.css'

export default function StockDetail() {
    const dispatch = useDispatch()
    const { stockTicker } = useParams()

    const [hasSubmitted, setHasSubmitted] = useState(false)
    const [stockName, setStockName] = useState("")
    const [stockPrice, setStockPrice] = useState()
    const [stockDesc, setStockDesc] = useState("")
    const [transaction, setTransaction] = useState("buy")

    const portfolio = useSelector((state) => state.portfolio)

    useEffect(() => {
        dispatch(getUserPortfolioThunk())
    }, [dispatch, hasSubmitted])

    const apiKey = process.env.REACT_APP_API_KEY
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockTicker}&apikey=${apiKey}`
    const url2 = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${stockTicker}&apikey=${apiKey}`

    useEffect(() => {
        fetch(url) //Fetches current market value of stock
            .then(res => res.json())
            .then((result) => {
                setStockPrice(result['Global Quote']['05. price'])
            })
        fetch(url2) //Fetches Full name with stock ticker
            .then(res => res.json())
            .then((result) => {
                setStockName(result['Name'])
                setStockDesc(result['Description'])
            })
    })

    if (Object.keys(portfolio).length === 0) return null

    // const ownedStockObj = portfolio.stocks[stockTicker]

    return (
        <>
            <div className={styles.bodyContainer}>
                <div className={styles.mainContainer}>
                    <div className={styles.leftHalfContainer}>
                        <div className={styles.stockNameContainer}>{stockName}</div>
                        <div className={styles.stockPriceContainer}>${parseFloat(stockPrice).toFixed(2)}</div>
                        <div className={styles.percentChangeContainer}>Percent Change (TBD)</div>
                        <div className={styles.stockChartContainer}>Stock Chart (TBD)</div>
                        <div className={styles.valueCostAnalyticsContainer}>
                            <div className={styles.marketValueContainer}>
                                Your market value (TBD)
                            </div>
                            <div className={styles.avgCostContainer}>
                                Your average cost (TBD)
                            </div>
                        </div>
                        <div className={styles.aboutContainer}>
                            <div className={styles.aboutHeader}>About</div>
                            <div className={styles.aboutInfoContainer}>{stockDesc}</div>
                        </div>
                    </div>
                    <div className={styles.rightHalfContainer}>
                        <div className={styles.transactionContainer}>
                            <div className={styles.transactionToggleContainer}>
                                <div
                                    className={styles.buyStockToggle}
                                    onClick={() => setTransaction("buy")}
                                >
                                    Buy {stockTicker}
                                </div>
                                <div
                                    className={styles.sellStockToggle}
                                    onClick={() => setTransaction("sell")}
                                >
                                    Sell {stockTicker}
                                </div>
                            </div>
                            {(transaction === "buy") &&
                                <BuyStockForm setHasSubmitted={setHasSubmitted} stockName={stockName} stockPrice={stockPrice} />
                            }
                            {(transaction === "sell") &&
                                <SellStockForm setHasSubmitted={setHasSubmitted} stockName={stockName} stockPrice={stockPrice} />
                            }
                            <div className={styles.buyingPowerContainer}>
                                ${parseFloat(portfolio.buyingPower).toFixed(2)} buying power available
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}