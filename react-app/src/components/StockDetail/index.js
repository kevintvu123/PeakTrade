import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { getUserPortfolioThunk } from "../../store/portfolio"
import StockChart from "./StockChart"
import BuyStockForm from "../Forms/BuyStockForm"
import SellStockForm from "../Forms/SellStockForm"
import styles from '../cssModules/StockDetail.module.css'

export default function StockDetail() {
    const dispatch = useDispatch()
    const { stockTicker } = useParams()

    const [hasSubmitted, setHasSubmitted] = useState(false)
    const [stockName, setStockName] = useState("")
    const [stockPrice, setStockPrice] = useState()
    const [stockChange, setStockChange] = useState()
    const [stockChangePercent, setStockChangePercent] = useState()
    const [scrollingStockPrice, setScrollingStockPrice] = useState()
    const [stockDesc, setStockDesc] = useState("No company information available")
    const [stockMarketCap, setStockMarketCap] = useState("-")
    const [stockPERatio, setStockPERatio] = useState("-")
    const [stock52High, setStock52High] = useState("-")
    const [stock52Low, setStock52Low] = useState("-")
    const [transaction, setTransaction] = useState("buy")
    const [transactionLoading, setTransactionLoading] = useState(false)

    const portfolio = useSelector((state) => state.portfolio)

    useEffect(() => {
        dispatch(getUserPortfolioThunk())
    }, [dispatch, hasSubmitted])

    const apiKey = process.env.REACT_APP_API_KEY
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockTicker}&apikey=${apiKey}`
    const url2 = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${stockTicker}&apikey=${apiKey}`
    const url3 = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${stockTicker}&apikey=${apiKey}`

    useEffect(() => {
        fetch(url3) //Fetches stockName from stockTicker
            .then(res => res.json())
            .then(result => setStockName(result['bestMatches'][0]['2. name']))
        fetch(url) //Fetches current market value of stock
            .then(res => res.json())
            .then((result) => {
                setStockPrice(result['Global Quote']['05. price'])
                setStockChange(parseFloat(result['Global Quote']['09. change']).toFixed(2))
                setStockChangePercent(parseFloat(result['Global Quote']['10. change percent']).toFixed(2))
            })
        fetch(url2) //Fetches Full name with stock ticker
            .then(res => res.json())
            .then((result) => {
                if (result['Description']) {
                    setStockDesc(result['Description'])
                    setStockMarketCap(result['MarketCapitalization'])
                    setStockPERatio(result['PERatio'])
                    setStock52High(result['52WeekHigh'])
                    setStock52Low(result['52WeekLow'])
                }
            })
    }, [url, url2, url3])

    const portfolioBool = Object.keys(portfolio).length
    if (!portfolioBool) return null

    const buyingPower = portfolio.buyingPower

    const ownedStockObj = portfolio.stocks[stockTicker] //returns undefined if stock isn't in portfolio
    const calcMarketValue = ownedStockObj ? ownedStockObj.amount * stockPrice : null
    const calcAvgCost = ownedStockObj ? ownedStockObj.amount * ownedStockObj.avgStockValue : null

    const numFormatter = (num) => {
        if (num > 999999999999) {
            return ((Math.abs(num) / 1000000000000).toFixed(2) + 'T')
        }
        if (num > 999999999) {
            return ((Math.abs(num) / 1000000000).toFixed(2) + 'B')
        }
        if (num > 999999) {
            return ((Math.abs(num) / 1000000).toFixed(2) + 'M')
        }

        return num
    }


    return (
        <>
            <div className={styles.bodyContainer}>
                <div className={styles.mainContainer}>
                    <div className={styles.leftHalfContainer}>
                        <div className={styles.stockNameContainer}>{stockName}</div>
                        <div className={styles.stockPriceContainer}>${scrollingStockPrice ? parseFloat(scrollingStockPrice).toFixed(2) : parseFloat(stockPrice).toFixed(2)}</div>
                        <div className={styles.percentChangeContainer}>${stockChange} ({stockChangePercent}%) Today</div>
                        <div className={styles.stockChartContainer}>
                            <StockChart stockTicker={stockTicker} setScrollingStockPrice={setScrollingStockPrice} />
                        </div>
                        {ownedStockObj && (
                            <div className={styles.valueCostAnalyticsContainer}>
                                <div className={styles.marketValueContainer}>
                                    Your market value
                                    <div className={styles.stockValueContainer}>
                                        ${calcMarketValue.toFixed(2)}
                                    </div>
                                    <div className={styles.totalReturnContainer}>
                                        <div>Total return</div>
                                        <div>${(calcMarketValue - calcAvgCost).toFixed(2)}</div>
                                    </div>
                                </div>
                                <div className={styles.avgCostContainer}>
                                    Your average cost
                                    <div className={styles.stockValueContainer}>
                                        ${calcAvgCost.toFixed(2)}
                                    </div>
                                    <div className={styles.totalReturnContainer}>
                                        <div>Shares</div>
                                        <div>{ownedStockObj.amount}</div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className={styles.aboutContainer}>
                            <div className={styles.aboutHeader}>About</div>
                            <div className={styles.aboutInfoContainer}>{stockDesc}</div>
                        </div>
                        <div className={styles.keyStatsContainer}>
                            <div className={styles.keyStatsHeader}>Key statistics</div>
                            <div className={styles.statsDiv}>
                                <div className={styles.eachStatDiv}>
                                    <div className={styles.statHeader}>Market cap</div>
                                    <div>{numFormatter(stockMarketCap)}</div>
                                </div>
                                <div className={styles.eachStatDiv}>
                                    <div className={styles.statHeader}>Price-Earnings ratio</div>
                                    <div>{stockPERatio}</div>
                                </div>
                                <div className={styles.eachStatDiv}>
                                    <div className={styles.statHeader}>52 Week high</div>
                                    <div>{stock52High}</div>
                                </div>
                                <div className={styles.eachStatDiv}>
                                    <div className={styles.statHeader}>52 Week low</div>
                                    <div>{stock52Low}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.rightHalfContainer}>
                        {transactionLoading &&
                            <div className={styles.transactionLoadingContainer}>
                                <div className={styles.loadingSpinner}></div>
                            </div>
                        }
                        {!transactionLoading &&
                            <div className={styles.transactionContainer}>
                                <div className={styles.transactionToggleContainer}>
                                    <div
                                        className={styles.buyStockToggle}
                                        style={{ color: transaction === "buy" ? '#00C805' : "white" }}
                                        onClick={() => setTransaction("buy")}
                                    >
                                        Buy {stockTicker}
                                    </div>
                                    {ownedStockObj &&
                                        <div
                                            className={styles.sellStockToggle}
                                            style={{ color: transaction === "sell" ? '#00C805' : "white" }}
                                            onClick={() => setTransaction("sell")}
                                        >
                                            Sell {stockTicker}
                                        </div>
                                    }
                                </div>
                                {(transaction === "buy") &&
                                    <BuyStockForm setHasSubmitted={setHasSubmitted} stockName={stockName} stockPrice={stockPrice} buyingPower={buyingPower} setTransactionLoading={setTransactionLoading} />
                                }
                                {(transaction === "sell") &&
                                    <SellStockForm setHasSubmitted={setHasSubmitted} stockName={stockName} stockPrice={stockPrice} setTransaction={setTransaction} ownedAmt={ownedStockObj?.amount} setTransactionLoading={setTransactionLoading} />
                                }
                                <div className={styles.buyingPowerContainer}>
                                    ${parseFloat(portfolio.buyingPower).toFixed(2)} buying power available
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}