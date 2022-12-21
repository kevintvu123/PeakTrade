from .db import db, environment, SCHEMA, add_prefix_for_prod


class Watchlist(db.Model):
    __tablename__ = "watchlists"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False
    )
    name = db.Column(db.String, nullable=False)

    user = db.relationship("User", back_populates="watchlists")
    watchlist_stocks = db.relationship(
        "Watchlist_Stock", back_populates="watchlist", cascade="all, delete-orphan"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "watchlistStocks": [
                watchlist_stock.to_dict() for watchlist_stock in self.watchlist_stocks
            ],
        }
