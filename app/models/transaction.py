from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime
from sqlalchemy.orm import validates

class Transaction(db.Model):
    __tablename__ = 'transactions'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    portfolio_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('portfolios.id')), nullable=False)
    stock_id = db.Column(db.String, db.ForeignKey(add_prefix_for_prod('stocks.ticker')), nullable=False)
    num_shares = db.Column(db.Float, nullable=False)
    average_price = db.Column(db.Float, nullable=False)
    total_expense = db.Column(db.Float, nullable=False)
    executed_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Define Relationships
    # Define Many-to-One relationship with Portfolio table
    portfolio = db.relationship('Portfolio', back_populates='transactions')
    # Define a Many-to-one relationship between Transaction and Stock
    stock = db.relationship('Stock', back_populates='transactions')



    def to_dict(self):
        return {
            'id': self.id,
            'portfolio_id': self.portfolio_id,
            'stock_id': self.stock_id,
            'num_shares': self.num_shares,
            'average_price': self.average_price,
            'total_expense': self.total_expense,
            'executed_at': self.executed_at
        }
