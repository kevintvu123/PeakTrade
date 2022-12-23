import { useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { postTransactionThunk } from "../../store/portfolio";

export default function BuyStockForm({ setHasSubmitted, stockName, stockPrice }) {
    const dispatch = useDispatch();
    const { stockTicker } = useParams();

    const [errors, setErrors] = useState([])
    const [quantity, setQuantity] = useState(0)

    const handleBuyStock = async (e) => {
        e.preventDefault();

        const errors = [];

        setErrors(errors)

        if (!errors.length) {
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

    return (
        <div>
            <form onSubmit={handleBuyStock}>
                <div>
                    <label htmlFor="buyStockQuantity">
                        Quantity
                    </label>
                    <input
                        id="buyStockQuantity"
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Buy Stock</button>
            </form>
        </div>
    )
}