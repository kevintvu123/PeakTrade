import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { postWatchlistThunk } from "../../store/watchlist";

import styles from "../cssModules/CreateWatchlistForm.module.css"

function CreateWatchlistForm({ setShowCreateWatchlist }) {
    const dispatch = useDispatch()

    const [watchlistName, setWatchlistName] = useState("")
    const [errors, setErrors] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = [];

        if (watchlistName.length > 25) {
            errors.push("Please enter a name that is less than 25 characters")
        }

        setErrors(errors);

        if (!errors.length) {
            const submitWatchlist = await dispatch(
                postWatchlistThunk({ name: watchlistName })
            )
                .then(() => setWatchlistName(""))
                .then(() => setShowCreateWatchlist(false))
            return submitWatchlist;
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                className={styles.createWatchlistInput}
                type="text"
                value={watchlistName}
                onChange={(e) => {
                    setWatchlistName(e.target.value)
                    setErrors([])
                }}
                placeholder="List Name"
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
            <div className={styles.createWatchlistButtonDiv}>
                <button className={styles.createWatchlistButton} type="submit">Create List</button>
            </div>
        </form>
    )

}

export default CreateWatchlistForm;