import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateWatchlistThunk } from "../../store/watchlist";
import styles from "../cssModules/EditWatchlistForm.module.css"

function EditWatchlistForm({ setShowEditModal, watchlistId }) {
    const dispatch = useDispatch()

    const watchlist = useSelector((state) => state.watchlist)

    let prevName = (watchlist.watchlists[watchlistId].name)

    const [watchlistName, setWatchlistName] = useState(prevName);
    const [errors, setErrors] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = [];

        if (watchlistName.length > 25) {
            errors.push(
                "Please enter a watchlist name that is less than 25 characters"
            );
        }

        setErrors(errors);

        if (!errors.length) {
            setShowEditModal(false);
            const editWatchlist = await dispatch(
                updateWatchlistThunk({ name: watchlistName }, watchlistId)
            )
            return editWatchlist;
        }
    }

    return (
        <div className={styles.editWatchlistFormContainer}>
            <div className={styles.editWatchlistHeader}>Edit List</div>
            <form onSubmit={handleSubmit}>
                <input
                    className={styles.editWatchlistInput}
                    type="text"
                    value={watchlistName}
                    onChange={(e) => {
                        setWatchlistName(e.target.value)
                        setErrors([])
                    }}
                    placeholder="Watchlist Name"
                    required
                />
                <div className={styles.errorMap}>
                    {errors.length > 0 && (
                        <div>
                            {errors.map((error) => (
                                <div key={error}>{error}</div>
                            ))}
                        </div>
                    )}
                </div>
                <button className={styles.editWatchlistButton} type="submit">Save</button>
            </form>
        </div>
    )
}

export default EditWatchlistForm;