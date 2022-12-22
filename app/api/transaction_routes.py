from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models import db, Transaction, Stock, User
from app.forms import TransactionForm, StockForm
from .auth_routes import validation_errors_to_error_messages

transaction_routes = Blueprint("transactions", __name__)


@transaction_routes.route("", methods=["POST"])
def handle_buy_transactions():

    data = request.get_json()
    data["csrf_token"] = request.cookies["csrf_token"]
    print(data)

    user_id = current_user.id
    user = User.query.get(user_id)

    form = TransactionForm(**data)

    if form.validate_on_submit():

        stock_in_portfolio = (
            Stock.query.filter(Stock.user_id == user_id)
            .filter(Stock.ticker == data["ticker"])
            .first()
        )  # This checks for an instance of the stock ticker in the user's portfolio

        if data["order_type"] == "buy":

            price = data["price"]
            quantity = data["quantity"]
            total_price = price * quantity

            user.buying_power = (
                user.buying_power - total_price
            )  # Updating users buying power

            if not stock_in_portfolio:  # Stock ticker doesn't exist in user's portfolio
                data["avg_stock_value"] = data["price"]
                data["amount"] = data["quantity"]

                stockForm = StockForm(**data)

                if stockForm.validate_on_submit():
                    print("MADE IT!!!!")

        if data["order_type"] == "sell":
            print("shouldn't make it here")

    return "this is it"
