from .db import db, environment, SCHEMA, add_prefix_for_prod


class Watchlist_Stock(db.Model):
    __tablename__ = "watchlist_stocks"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    watchlist_id = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod("watchlists.id")), nullable=False
    )
    ticker = db.Column(db.String, nullable=False)
    market_value = db.Column(db.Float, nullable=False)

    watchlist = db.relationship("Watchlist", back_populates="watchlist_stocks")

    def to_dict(self):
        return {"id": self.id, "watchlistId": self.watchlist_id, "ticker": self.ticker}
