from .db import db, environmet, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Transaction(db.Model):
    __tablename__ = 'transactions'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer,
                        db.ForeignKey(add_prefix_for_prod("users.id")),
                        nullable=False)
