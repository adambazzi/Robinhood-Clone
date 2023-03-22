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
    num_shares = db.Column(db.Integer, nullable=False)
    average_price = db.Column(db.Integer, nullable=False)
    total_expense = db.Column(db.Integer, nullable=False)
    executed_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Define Relationships
    # Define Many-to-One relationship with Portfolio table
    portfolio = db.relationship('Portfolio', back_populates='transactions')
    # Define a Many-to-one relationship between Transaction and Stock
    stock = db.relationship('Stock', back_populates='transactions')


    # Validations
    @validates('average_price', 'total_expense', 'num_shares')
    def validate_integer_value(self, key, value):
        if value <= 0:
            raise ValueError(f'{key} must be a non-negative integer.')
        return value

    def to_dict(self):
        return {
            'id': self.id,
            'portfolioId': self.portfolio_id,
            'stockId': self.stock_id,
            'numShares': self.num_shares,
            'average_price': self.average_price,
            'total_expense': self.total_expense,
            'executedAt': self.executed_at
        }
