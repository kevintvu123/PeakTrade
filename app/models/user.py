from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from datetime import datetime
from .groups import group_members


class User(db.Model, UserMixin):
    __tablename__ = "users"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    first_name = db.Column(db.String, nullable=False)
    last_name = db.Column(db.String, nullable=False)
    buying_power = db.Column(db.Float, default=10000.00)
    hashed_password = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now)

    stocks = db.relationship("Stock", back_populates="user")
    transactions = db.relationship("Transaction", back_populates="user")
    watchlists = db.relationship("Watchlist", back_populates="user")
    groups = db.relationship("Group", secondary=group_members, back_populates="members")

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "firstName": self.first_name,
            "lastName": self.last_name,
            "buyingPower": self.buying_power,
            "createdAt": self.created_at,
            "stocks": [stock.to_dict() for stock in self.stocks],
            "transactions": [
                transaction.to_dict() for transaction in self.transactions
            ],
            "groups": [group.to_dict_base() for group in self.groups],
            "watchlists": [watchlist.to_dict() for watchlist in self.watchlists],
        }
