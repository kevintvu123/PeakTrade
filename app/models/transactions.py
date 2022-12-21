from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime


class Transaction(db.Model):
    __tablename__ = "transactions"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False
    )
    ticker = db.Column(db.String, nullable=False)
    name = db.Column(db.String, nullable=False)
    price = db.Column(db.Float, nullable=False)
    quantity = db.Column(db.Float, nullable=False)
    order_type = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now)

    user = db.relationship("User", back_populates="transactions")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "ticker": self.ticker,
            "name": self.name,
            "price": self.price,
            "quantity": self.quantity,
            "orderType": self.order_type,
            "createdAt": self.created_at,
        }
