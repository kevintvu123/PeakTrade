from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models import db, Transaction, Stock, User
from app.forms import TransactionForm, StockForm
from .auth_routes import validation_errors_to_error_messages

transaction_routes = Blueprint("transactions", __name__)


@transaction_routes.route("")
@login_required
def handle_get_transactions():

    user_id = current_user.id
    user = User.query.get(user_id)

    response = user.to_dict()

    return response


@transaction_routes.route("", methods=["POST"])
@login_required
def handle_create_update_delete_transactions():

    data = request.get_json()
    data["csrf_token"] = request.cookies["csrf_token"]

    user_id = current_user.id
    user = User.query.get(user_id)

    form = TransactionForm(**data)

    if form.validate_on_submit():

        # This checks for an instance of the stock ticker in the user's portfolio
        stock_in_portfolio = (
            Stock.query.filter(Stock.user_id == user_id)
            .filter(Stock.ticker == data["ticker"])
            .first()
        )

        # Calculating Total price to update User's buying power
        price = data["price"]
        quantity = data["quantity"]
        total_price = float(price) * float(quantity)

        if data["order_type"] == "buy":

            # Creating key-value for StockForm
            data["avg_stock_value"] = data["price"]
            data["amount"] = data["quantity"]

            # Stock ticker doesn't exist in user's portfolio (Create)
            if not stock_in_portfolio:

                stockForm = StockForm(**data)

                if stockForm.validate_on_submit():
                    # Creating new transaction instance
                    create_transaction = Transaction(
                        user_id=user_id,
                        ticker=data["ticker"],
                        name=data["name"],
                        price=data["price"],
                        quantity=data["quantity"],
                        order_type=data["order_type"],
                    )
                    # Creating new stock instance in portfolio
                    create_stock_portfolio = Stock(
                        user_id=user_id,
                        ticker=data["ticker"],
                        name=data["name"],
                        amount=data["amount"],
                        avg_stock_value=data["avg_stock_value"],
                    )

                    # Updating User's Buying Power
                    user.buying_power = user.buying_power - float(total_price)

                    db.session.add_all([create_transaction, create_stock_portfolio])
                    db.session.commit()

                    responseObj = {}
                    responseObj["user"] = user.to_dict()

                    return responseObj

            # Stock ticker does exist in the user's portfolio (Update)
            if stock_in_portfolio:
                # Calculating new average price for stock
                new_amount = stock_in_portfolio.amount + int(data["amount"])
                new_total_price = (
                    stock_in_portfolio.avg_stock_value * stock_in_portfolio.amount
                ) + (int(data["quantity"]) * int(float(data["price"])))
                new_stock_avg_price = new_total_price / new_amount

                data["avg_stock_value"] = new_stock_avg_price
                data["amount"] = new_amount

                stockForm = StockForm(**data)

                if stockForm.validate_on_submit():
                    create_transaction = Transaction(
                        user_id=user_id,
                        ticker=data["ticker"],
                        name=data["name"],
                        price=data["price"],
                        quantity=data["quantity"],
                        order_type=data["order_type"],
                    )

                    # Updating Stock
                    stock_in_portfolio.amount = data["amount"]
                    stock_in_portfolio.avg_stock_value = data["avg_stock_value"]

                    # Updating User's Buying Power
                    user.buying_power = user.buying_power - float(total_price)

                    db.session.add(create_transaction)
                    db.session.commit()

                    responseObj = {}
                    responseObj["user"] = user.to_dict()

                    return responseObj

        if data["order_type"] == "sell":

            # Still need to create an error handler for stock not in portfolio

            if stock_in_portfolio:
                # Sell all stocks (Delete)
                if stock_in_portfolio.amount == int(data["quantity"]):
                    # Creating new transaction instance
                    create_transaction = Transaction(
                        user_id=user_id,
                        ticker=data["ticker"],
                        name=data["name"],
                        price=data["price"],
                        quantity=data["quantity"],
                        order_type=data["order_type"],
                    )

                    # Update User Buying Power
                    user.buying_power = user.buying_power + float(total_price)

                    # Delete instance of stock in portfolio since User sold all stocks
                    db.session.add(create_transaction)
                    db.session.delete(stock_in_portfolio)
                    db.session.commit()

                    responseObj = {}
                    responseObj["user"] = user.to_dict()

                    return responseObj

                # Sell portion of stock (Update)
                if stock_in_portfolio.amount > int(data["quantity"]):

                    new_amount = stock_in_portfolio.amount - int(data["quantity"])
                    data["avg_stock_value"] = stock_in_portfolio.avg_stock_value
                    data["amount"] = new_amount

                    stockForm = StockForm(**data)

                    if stockForm.validate_on_submit():
                        # Creating new transaction instance
                        create_transaction = Transaction(
                            user_id=user_id,
                            ticker=data["ticker"],
                            name=data["name"],
                            price=data["price"],
                            quantity=data["quantity"],
                            order_type=data["order_type"],
                        )

                        # Update Stock Amount in User's Portfolio
                        stock_in_portfolio.amount = data["amount"]

                        # Update User Buying Power
                        user.buying_power = user.buying_power + float(total_price)

                        db.session.add(create_transaction)
                        db.session.commit()

                        responseObj = {}
                        responseObj["user"] = user.to_dict()

                        return responseObj

    return {"error": "Please enter a valid quantity"}, 400
