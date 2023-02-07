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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = [];

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

    if (Object.keys(watchlist).length === 0) return null

    const watchlistArr = watchlist.watchlistsArr

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
                                onChange={(e) => setSelectedWatchlist(watchlist.id)}
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
            </form>
        </div>
    )
}

export default AddWatchlistStockForm;