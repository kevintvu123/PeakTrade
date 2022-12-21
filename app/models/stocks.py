from .db import db, environment, SCHEMA, add_prefix_for_prod

class Stock(db.Model):
    __tablename__= 'stocks'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer,
                        db.ForeignKey(add_prefix_for_prod("users.id")),
                        nullable=False)
    name = db.Column(db.String, nullable=False)
    ticker = db.Column(db.String, nullable=False)
    amount = db.Column(db.Integer, nullable=False)
    market_value = db.Column(db.Float, nullable=False)

    user = db.relationship("User", back_populates="stocks")

    def to_dict(self):
        return {
            'name': self.name,
            'ticker': self.ticker,
            'amount': self.amount,
            'market_value': self.market_value
        }
