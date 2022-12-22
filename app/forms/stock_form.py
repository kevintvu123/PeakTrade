from flask_wtf import FlaskForm
from wtforms import StringField, FloatField
from wtforms.validators import DataRequired


class StockForm(FlaskForm):
    ticker = StringField("Ticker", [DataRequired()])
    name = StringField("Name", [DataRequired()])
    avg_stock_value = FloatField("Average Stock Value", [DataRequired()])
    amount = FloatField("Amount", [DataRequired()])
