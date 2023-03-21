from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime
from sqlalchemy.orm import validates

class Investments(db.Model):
    __tablename__ = 'investments'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    portfolio_id = db.Column(db.Integer, db.ForeignKey('portfolios.id', index=True), nullable=False)
    stock_id = db.Column(db.Integer, db.ForeignKey('stocks.id', index=True), nullable=False)
    num_shares = db.Column(db.Integer, nullable=False)
    average_price = db.Column(db.Integer, nullable=False)
    executed_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Define Relationships
    # Define Many-to-One relationship with Portfolio table
    portfolio = db.relationship('Portfolio', back_populates='transactions')
    # Define a one-to-one relationship between Transaction and Stock
    stock = db.relationship('Stock', uselist=False, back_populates='transaction')


    # Validations
    @validates('average_price', 'total_expense', 'shares')
    def validate_integer_value(self, key, value):
        if value <= 0:
            raise ValueError(f'{key} must be a non-negative integer.')
        return value

    # Define a custom property for the total value of investment
    @property
    def total_value(self):
        return self.num_shares * self.average_price

    def to_dict(self):
        return {
            'id': self.id,
            'portfolioId': self.portfolio_id,
            'stockId': self.stock_id,
            'numShares': self.num_shares,
            'average_price': self.average_price,
            'total_value': self.total_value,
            'executedAt': self.executed_at
        }
