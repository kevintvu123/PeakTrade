import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { getUserPortfolioThunk } from '../../store/portfolio'

import OwnedStocks from './OwnedStocks'
import PortfolioValue from './PortfolioValue'
// import PortfolioChart from './PortfolioChart'
import ApexPortfolioChart from './ApexPortfolioChart'
import Group from './Group'

import styles from '../cssModules/Homepage.module.css'

export default function Homepage() {
    const dispatch = useDispatch()

    const [scrollingStockPrice, setScrollingStockPrice] = useState()

    const portfolio = useSelector((state) => state.portfolio)

    useEffect(() => {
        dispatch(getUserPortfolioThunk())
    }, [dispatch])

    if (Object.keys(portfolio).length === 0) return null

    const buyingPower = ((portfolio.buyingPower.toFixed(2)))

    function formatCommas(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    return (
        <>
            <div className={styles.bodyContainer}>
                <div className={styles.mainContainer}>
                    <div className={styles.leftHalfContainer}>
                        <div className={styles.portfolioValueContainer}>
                            ${scrollingStockPrice ? scrollingStockPrice : <PortfolioValue portfolio = {portfolio}/>}
                        </div>
                        <div className={styles.portfolioChangeContainer}>

                        </div>
                        <div className={styles.portfolioChartContainer}>
                            {/* <PortfolioChart /> */}
                            <ApexPortfolioChart portfolio={portfolio} setScrollingStockPrice={setScrollingStockPrice}/>
                        </div>
                        <div className={styles.buyingPowerContainer}>
                            <div>Buying Power</div>
                            <div>${formatCommas(buyingPower)}</div>
                        </div>
                        <div className={styles.groupContainer}>
                            <Group />
                        </div>
                    </div>
                    <div className={styles.rightHalfContainer}>
                        <OwnedStocks />
                    </div>
                </div>
            </div>
        </>
    )
}