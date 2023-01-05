import { useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { postTransactionThunk } from "../../store/portfolio";
import styles from "../cssModules/BuyStockForm.module.css"

export default function BuyStockForm({ setHasSubmitted, stockName, stockPrice, buyingPower, setTransactionLoading }) {
    const dispatch = useDispatch();
    const { stockTicker } = useParams();

    const [errors, setErrors] = useState([])
    const [quantity, setQuantity] = useState(0)

    const handleBuyStock = async () => {

        const errors = [];


        if (!quantity) {
            errors.push("Please enter a quantity")
        }

        if ((stockPrice * quantity) > buyingPower) {
            errors.push("Not Enough Buying Power")
        }

        setErrors(errors)

        if (!errors.length) {
            setTransactionLoading(true)
            setTimeout(() => setTransactionLoading(false), 1000)
            const buyStock = await dispatch(
                postTransactionThunk({
                    ticker: stockTicker,
                    name: stockName,
                    price: stockPrice,
                    quantity: quantity,
                    order_type: "buy"
                })
            )
                .then(() => setHasSubmitted((prevValue) => !prevValue))
                .then(() => setQuantity(0))
            return buyStock
        }
    }

    const preventMinus = (e) => {
        if (e.code === 'Minus') {
            e.preventDefault();
        }
    };

    return (
        <div className={styles.buyFormContainer}>
            <div className={styles.eachFormRowContainer}>
                <div>Order Type</div>
                <div>Market Order</div>
            </div>
            <div className={styles.eachFormRowContainer}>
                <div>Buy In</div>
                <div>Shares</div>
            </div>
            <div className={styles.eachFormRowContainer}>
                <div>Shares</div>
                <input
                    type="number"
                    placeholder="0"
                    value={quantity}
                    min="0"
                    onKeyPress={preventMinus}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                />
            </div>
            <div className={styles.marketPriceContainer}>
                <div>Market Price</div>
                <div>${parseFloat(stockPrice).toFixed(2)}</div>
            </div>
            <div className={styles.eachFormRowContainer}>
                <div>Estimated Cost</div>
                <div>${parseFloat(parseFloat(stockPrice) * quantity).toFixed(2)}</div>
            </div>
            <div className={styles.errorContainer}>
                {errors.map((error) => (
                    <div key={error}>{error}</div>
                ))}
            </div>
            <div
                className={styles.reviewOrderButton}
                onClick={() => { handleBuyStock() }}
            >
                Review order
            </div>
        </div>
    )
}