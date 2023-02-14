import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
import { getUserPortfolioThunk } from "../../store/portfolio"

import OwnedStockPrice from "./OwnedStockPrice"
import MiniStockChart from "./MiniStockChart"

import { EditWatchlistModal } from "../../context/EditWatchlistModal"

import CreateWatchlistForm from "../Forms/CreateWatchlistForm"

import styles from '../cssModules/OwnedStocks.module.css'
import plusIcon from '../../assets/plus-watchlist-icon.png'
import moreIcon from '../../assets/more-icon.png'
import expandIcon from '../../assets/invert-icon.png'
import xIcon from '../../assets/x-icon.png'
import { deleteWatchlistThunk, getUserWatchlistThunk } from "../../store/watchlist"
import EditWatchlistForm from "../Forms/EditWatchlistForm"

export default function OwnedStocks() {
    const dispatch = useDispatch()
    const history = useHistory()

    const [showCreateWatchlist, setShowCreateWatchlist] = useState(false)
    const [showMenu, setShowMenu] = useState(false)
    const [watchlistId, setWatchlistId] = useState()
    const [showEditModal, setShowEditModal] = useState(false)
    const [showWatchlistStocks, setShowWatchlistStocks] = useState(false)

    const portfolio = useSelector((state) => state.portfolio)
    const watchlist = useSelector((state) => state.watchlist)

    useEffect(() => {
        dispatch(getUserPortfolioThunk())
        dispatch(getUserWatchlistThunk())
    }, [dispatch])

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = () => {
            setShowMenu(false);
        };

        document.addEventListener("click", closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    if (Object.keys(portfolio).length === 0 || Object.keys(watchlist).length === 0) return null

    const stocksArr = portfolio.stocksArr
    const watchlistArr = watchlist.watchlistsArr

    const redirectStock = (stockTicker) => {
        history.push(`/stocks/${stockTicker}`)
    }

    const handleDeleteWatchlist = async (watchlistId) => {
        const deleteWatchlist = await dispatch(deleteWatchlistThunk(watchlistId))
        return deleteWatchlist
    }

    const handleDeleteWatchlistStock = async (e, watchlistStockId) => {
        e.stopPropagation();
        console.log(watchlistStockId)
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
                    <>
                        <div className={styles.watchlistDiv}>
                            <div>{watchlist.name}</div>
                            <div className={styles.iconContainer}>
                                <div className={styles.plusIconContainer} onClick={() => {
                                    setShowMenu((prevVal) => !prevVal)
                                    setWatchlistId(watchlist.id)
                                }}>
                                    <img src={moreIcon} alt='more icon' />
                                </div>
                                <div className={styles.plusIconContainer} onClick={() => {
                                    setShowWatchlistStocks((prevVal) => !prevVal)
                                    setWatchlistId(watchlist.id)
                                }}>
                                    <img src={expandIcon} alt='expand icon' />
                                </div>
                            </div>
                        </div>
                        {showMenu && (watchlistId === watchlist.id) && (
                            <div className={styles.dropdownMenu}>
                                <div className={styles.editListDiv} onClick={() => setShowEditModal(true)}>
                                    Edit list
                                </div>
                                <div className={styles.editListDiv} onClick={() => handleDeleteWatchlist(watchlistId)}>
                                    Delete list
                                </div>
                            </div>
                        )}
                        {showEditModal && (
                            <EditWatchlistModal onClose={() => {
                                setShowEditModal(false)
                            }}>
                                <EditWatchlistForm watchlistId={watchlistId} setShowEditModal={setShowEditModal} />
                            </EditWatchlistModal>
                        )
                        }
                        {watchlist.watchlistStocks.map((watchlistStock) => {
                            return (showWatchlistStocks && (watchlist.id === watchlistId) &&
                                <div className={styles.watchlistStockDiv} onClick={() => { redirectStock(watchlistStock.ticker) }}>
                                    {watchlistStock.ticker}
                                    <div className={styles.miniStockChartContainer}>
                                        <MiniStockChart stockTicker={watchlistStock.ticker} />
                                    </div>
                                    <OwnedStockPrice stockTicker={watchlistStock.ticker} />
                                    <div className={styles.xIconContainer} onClick={(e) => {
                                        handleDeleteWatchlistStock(e, watchlistStock.id)
                                    }}>
                                        <img src={xIcon} alt='x icon' />
                                    </div>
                                </div>
                            )
                        })}
                    </>
                )
            })}
        </div >
    )
}
