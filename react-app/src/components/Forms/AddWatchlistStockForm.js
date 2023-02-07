import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserWatchlistThunk, postWatchlistStockThunk } from "../../store/watchlist";
import styles from "../cssModules/AddWatchlistStockForm.module.css"

function AddWatchlistStockForm({ setShowWatchlistStockModal, stockTicker }) {
    const dispatch = useDispatch();

    const [selectedWatchlist, setSelectedWatchlist] = useState(null)
    const [errors, setErrors] = useState([]);

    const watchlist = useSelector((state) => state.watchlist)

    useEffect(() => {
        dispatch(getUserWatchlistThunk())
    }, [dispatch])


    if (Object.keys(watchlist).length === 0) return null

    const watchlistArr = watchlist.watchlistsArr

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = [];

        if (!selectedWatchlist) {
            errors.push("You need to select a list")
        }

        if (selectedWatchlist) {
            const watchlistStocks = (watchlist.watchlists[selectedWatchlist].watchlistStocks)
            watchlistStocks.forEach((stock) => {
                if (stock.ticker === stockTicker) {
                    errors.push("You already have this stock in chosen list")
                }
            })
        }

        setErrors(errors);

        if (!errors.length) {
            setShowWatchlistStockModal(false);
            const submitWatchlistStock = await dispatch(
                postWatchlistStockThunk({ ticker: stockTicker }, selectedWatchlist)
            )
            return submitWatchlistStock;
        }
        // console.log(`Selected option: ${selectedWatchlist}`)
    }

    return (
        <div className={styles.addWatchlistStockFormContainer}>
            <div className={styles.addWatchlistStockHeader}>Add {stockTicker} to Your Lists</div>
            <form className={styles.addWatchlistStockForm} onSubmit={handleSubmit}>
                <div className={styles.watchlistArrContainer}>
                    {watchlistArr.map((watchlist) => (
                        <div className={styles.eachWatchlistContainer}>
                            <input
                                className={styles.eachWatchlistInput}
                                type="radio"
                                value={watchlist.id}
                                checked={selectedWatchlist === watchlist.id}
                                onChange={(e) => {
                                    setErrors([])
                                    setSelectedWatchlist(watchlist.id)
                                }}
                            />
                            <label key={watchlist.id}>
                                {watchlist.name}
                            </label>
                        </div>
                    ))}
                </div>
                <div className={styles.buttonContainer}>
                    <button type="submit">Save Changes</button>
                </div>
                <div className={styles.errorMap}>
                    {errors.length > 0 && (
                        <div>
                            {errors.map((error) => (
                                <div key={error}>{error}</div>
                            ))}
                        </div>
                    )}
                </div>
            </form>
        </div>
    )
}

export default AddWatchlistStockForm;