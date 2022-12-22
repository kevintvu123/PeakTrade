from flask_wtf import FlaskForm
from wtforms import StringField, FloatField
from wtforms.validators import DataRequired


class TransactionForm(FlaskForm):
    ticker = StringField("Ticker", [DataRequired()])
    name = StringField("Name", [DataRequired()])
    price = FloatField("Price", [DataRequired()])
    quantity = FloatField("Quantity", [DataRequired()])
